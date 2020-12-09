/* eslint-disable comma-dangle */
//* **************************************************

import {AgentCamera} from "@/engine/AgentCamera.ts";
import {
  AmbientLight,
  AxesHelper,
  BasicShadowMap,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PlaneGeometry,
  Raycaster,
  RepeatWrapping,
  Scene,
  SpotLight,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import {foundationGridColor, selectionBoxColor} from "@/engine/globals.ts";
import {app} from "@/engine/app";
import {findObjectAgent} from "@/engine/helperfunctions.ts";
import {Agent} from "@/engine/Agent";
import {AgentRepository} from "@/engine/agent/AgentRepository";
import {AgentDescription} from "@/engine/agent/AgentDescription";
import {AddAgentToWorldCommand} from "@/model/commands/AddAgentToWorld";
import {GridVector} from "@/model/util/GridVector";

// FIXME: Think about separating splitting this class in a "World" abstraction, managing current agents, and a general rendering management class (name unknown, AgentCube not optimal)
export class AgentCube {
  rows: number;
  columns: number;
  layers: number;
  cellSize: number;
  grid: Array<Array<Array<Array<Agent>>>>;
  agentHovered: Agent | null;
  agentSelected: Agent | null;
  raycaster: Raycaster;
  mouseMove: Vector2;
  mouseClick: Vector2;
  container!: HTMLElement;
  scene!: Scene;
  camera!: AgentCamera;
  renderer!: WebGLRenderer;
  foundationHoverShape!: LineSegments;
  foundationSurface!: Mesh;
  // FIXME: move to app
  repository: AgentRepository;
  selectedAgent!: AgentDescription | undefined;

  constructor(rows = 9, columns = 16, layers = 1, cellSize = 20.0) {
    this.rows = rows;
    this.columns = columns;
    this.layers = layers;
    this.cellSize = cellSize;
    // this.shape = null;
    this.grid = new Array(layers);
    for (let layer = 0; layer < layers; layer++) {
      this.grid[layer] = new Array(rows);
      for (let row = 0; row < rows; row++) {
        this.grid[layer][row] = new Array(columns);
        for (let column = 0; column < columns; column++) {
          this.grid[layer][row][column] = [];
        }
      }
    }
    this.agentHovered = null;
    this.agentSelected = null;
    this.raycaster = new Raycaster();
    this.mouseMove = new Vector2();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.mouseMove.x = null; // don't start with valid coordinate

    this.mouseClick = new Vector2();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.mouseClick.x = null; // don't start with valid coordinate
    this.repository = new AgentRepository();
  }

  init3DSystem() {
    this.initTHREE();
    // this.addFoundationGrid();
    this.addFoundationHover();
    this.addFoundationSurface();
  }

  initTHREE() {
    //  scene
    const container: HTMLElement | null = document.querySelector(".scene");
    if (container == null) {
      throw new Error("Could not find DOM element with class 'scene'");
    }
    this.container = container;
    this.scene = new Scene();

    //  camera
    const fov = 35;
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const near = 0.01;
    const far = 50000;

    this.camera = new AgentCamera(fov, aspect, near, far);
    this.camera.aim(200, -400, 600, 200, 400, 0);
    // this.camera.position.set(300, 400, 500);
    // this.camera.lookAt(0, 0, 0);

    // lights
    const ambientLight = new AmbientLight(0x404040, 2);
    this.scene.add(ambientLight);

    const spotLight = new SpotLight(0xffffff, 1.0);
    spotLight.position.set(500, 0, 800);
    spotLight.castShadow = true;
    spotLight.shadow.radius = 8;

    // pointLight.shadow.bias = -0.0001;
    spotLight.shadow.mapSize.width = 1024 * 8;
    spotLight.shadow.mapSize.height = 1024 * 8;

    spotLight.shadow.camera.near = 0.1;
    spotLight.shadow.camera.far = 2500;
    this.scene.add(spotLight);

    // renderer
    this.renderer = new WebGLRenderer({antialias: true, alpha: true});
    this.renderer.sortObjects = false; // to work with disabled depth testing
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = BasicShadowMap;

    this.container.appendChild(this.renderer.domElement);

    const axesHelper = new AxesHelper(50);
    axesHelper.position.x = 0;
    axesHelper.position.y = 0;
    axesHelper.position.z = 50;
    this.scene.add(axesHelper);
  }

  threeResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  broadcast(methodName: string) {
    this.grid.forEach((layer) => {
      layer.forEach((row) => {
        row.forEach((column) => {
          column.forEach((agent: any) => {
            agent[methodName]();
          });
        });
      });
    });
  }

  addFoundationGrid() {
    const points = [];
    /// ignore layers for the moment
    for (let row = 0; row < this.rows + 1; row++) {
      points.push(new Vector3(0.0, row * this.cellSize, 0.0));
      points.push(new Vector3(this.columns * this.cellSize, row * this.cellSize, 0.0));
    }
    for (let column = 0; column < this.columns + 1; column++) {
      points.push(new Vector3(column * this.cellSize, 0.0, 0.0));
      points.push(new Vector3(column * this.cellSize, this.rows * this.cellSize, 0.0));
    }
    const material = new LineBasicMaterial({color: foundationGridColor});
    const geometry = new BufferGeometry().setFromPoints(points);
    const foundationGrid = new LineSegments(geometry, material);
    this.scene.add(foundationGrid);
  }

   addFoundationSurface() {
    const texturePath = "textures/";
    const texturesFile = "chess_texture.png";
    const loader = new TextureLoader();
    loader.load(
      `${texturePath}${texturesFile}`,
      texture => {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(Math.ceil(this.columns / 2), Math.ceil(this.rows / 2));
        this.foundationSurface = new Mesh(
          new PlaneGeometry(this.columns * this.cellSize, this.rows * this.cellSize),
          new MeshPhongMaterial({map: texture})
        );
        this.foundationSurface.position.x = 0.5 * this.columns * this.cellSize;
        this.foundationSurface.position.y = 0.5 * this.rows * this.cellSize;
        this.foundationSurface.position.z = 0.0;
        this.foundationSurface.userData.isFoundation = true;
        this.foundationSurface.receiveShadow = true;
        this.scene.add(this.foundationSurface);
      },
      undefined,
      // eslint-disable-next-line handle-callback-err
      err => console.error("cannot load texture")
    );
  }

  addFoundationHover() {
    const z = 1.0;
    const points = []; // square with a long vertical antenna
    points.push(new Vector3(0.0, 0.0, z));
    points.push(new Vector3(this.cellSize, 0.0, z));

    points.push(new Vector3(this.cellSize, 0.0, z));
    points.push(new Vector3(this.cellSize, this.cellSize, z));

    points.push(new Vector3(this.cellSize, this.cellSize, z));
    points.push(new Vector3(0.0, this.cellSize, z));

    points.push(new Vector3(0.0, this.cellSize, z));
    points.push(new Vector3(0.0, 0.0, z));

    points.push(new Vector3(0.5 * this.cellSize, 0.5 * this.cellSize, z));
    points.push(new Vector3(0.5 * this.cellSize, 0.5 * this.cellSize, 2 * this.cellSize));

    const material = new LineBasicMaterial({color: selectionBoxColor});
    // material.depthTest = false;
    const geometry = new BufferGeometry().setFromPoints(points);
    this.foundationHoverShape = new LineSegments(geometry, material);
    this.scene.add(this.foundationHoverShape);
  }

  step() {
    this.broadcast("step");
  }

  draw() {
    // no actual drawing happening here. Shapes are in the scene graph
    this.broadcast("draw");
  }

  clickAt(row: number, column: number, layer = 0) {
    if (this.selectedAgent != null) {
      app.undoManager.execute(new AddAgentToWorldCommand(this.selectedAgent.createAgent(), new GridVector(column, row, layer)));
    }
  }

  hoverAt(row: number, column: number, layer = 0) {
    this.foundationHoverShape.position.x = column * this.cellSize;
    this.foundationHoverShape.position.y = row * this.cellSize;
  }

  pushAgent(agent: Agent, row: number, column: number, layer = 0) {
    if (agent.shape.mesh.parent == null) {
      this.scene.add(agent.shape.mesh);
    }

    const agents = this.grid[layer][row][column];
    const agentAtTop = agents[agents.length - 1];

    // adjust geometry
    // FIXME: If agent would be aware of the cell size it could calculate the correct coordinates by itself
    agent.x = column * this.cellSize + 0.5 * this.cellSize;
    agent.y = row * this.cellSize + 0.5 * this.cellSize;

    if (agentAtTop == null) {
      agent.z = layer * this.cellSize;
    } else {
      agent.z = agentAtTop.z + agentAtTop.depth;
    }

    // adjust topology
    agent.row = row;
    agent.column = column;
    agent.layer = layer;
    // adjust part hierarchy
    agent.parent = this;
    // update stack
    agents.push(agent);
  }

  removeAgent(agent: Agent, removeFromScene = false) {
    const mesh = agent.shape.mesh;
    const parent = mesh.parent!;
    if (removeFromScene) {
      parent.remove(agent.shape.mesh);
    }

    const stack = this.grid[agent.layer][agent.row][agent.column];
    const index = stack.indexOf(agent);
    if (index > -1) {
      stack.splice(index, 1);
    }
  }

  processMouseHover() {
    if (this.mouseMove.x !== null) {
      this.raycaster.setFromCamera(this.mouseMove, this.camera);
      const intersections = this.raycaster.intersectObjects(this.scene.children, true);
      const firstIntersection = intersections.filter(intersection => intersection.object !== this.foundationHoverShape)[0];
      let agent = null;
      if (firstIntersection) {
        if (firstIntersection.object.userData.isFoundation) {
          this.hoverAt(
            Math.floor(firstIntersection.point.y / this.cellSize),
            Math.floor(firstIntersection.point.x / this.cellSize));
        } else {
          agent = findObjectAgent(firstIntersection.object);
        }
      }
      if (agent !== this.agentHovered) {
        if (this.agentHovered) {
          this.agentHovered.unhover();
          this.agentHovered = null;
        }
        if (agent) {
          agent.hover();
          this.agentHovered = agent;
        }
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      this.mouseMove.x = null;
    }
  }

  processMouseClick() {
    if (this.mouseClick.x != null) {
      this.raycaster.setFromCamera(this.mouseClick, this.camera);
      const intersections = this.raycaster.intersectObjects(this.scene.children, true);
      const firstIntersection = intersections.filter(intersection => intersection.object !== this.foundationHoverShape)[0];
      let agent = null;
      if (firstIntersection) {
        if (firstIntersection.object.userData.isFoundation) {
          this.clickAt(Math.floor(firstIntersection.point.y / this.cellSize),
            Math.floor(firstIntersection.point.x / this.cellSize));
        } else {
          agent = findObjectAgent(firstIntersection.object);
        }
      }
      if (agent !== this.agentSelected) {
        if (this.agentSelected) {
          this.agentSelected.deselect();
          this.agentSelected = null;
        }
        if (agent) {
          agent.select();
          this.agentSelected = agent;
        }
      }
      // eslint-disable-next-line
      // @ts-ignore
      this.mouseClick.x = null;
    }
  }

  render() {
    this.processMouseHover();
    this.processMouseClick();
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(app.agentCube.animate);
    this.renderer.render(this.scene, this.camera);
  }

  addToScene(object3D: Object3D) {
    this.scene.add(object3D);
  }
}
