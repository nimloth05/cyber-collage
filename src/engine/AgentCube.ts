/* eslint-disable comma-dangle */
//* **************************************************

import {AgentCamera} from "@/engine/AgentCamera.ts";
import {
  AmbientLight,
  AxesHelper,
  BasicShadowMap,
  BufferGeometry,
  Color,
  DirectionalLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PlaneGeometry,
  Raycaster,
  RepeatWrapping,
  Scene,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import {foundationGridColor, selectionBoxColor} from "@/engine/globals.ts";
import {app} from "@/engine/app";
import {findObjectAgent} from "@/engine/helperfunctions.ts";
import {Agent} from "@/engine/Agent";
import {AgentClass} from "@/engine/agent/AgentClass";
import {AddAgentToWorldCommand} from "@/model/commands/AddAgentToWorld";
import {GridVector} from "@/model/util/GridVector";

// --------------------------------------
// Scene Edit Objects Classes
// --------------------------------------

class FoundationSurface extends Mesh {
  // can differentiate from other ohter Object3D using obj.constructor.name
}

class FoundationGrid extends LineSegments {
  // can differentiate from other ohter Object3D using obj.constructor.name
}

class FoundationHover extends LineSegments {
  // can differentiate from other ohter Object3D using obj.constructor.name
}

export type FindAgentResult = { agent: Agent | null; row: number; column: number };

/**
 /* AgentCube
 /*   A 4D Matrix containing and managing agents
 /*   row, column, layer, stack
 **/
// FIXME: Code smell: Class has multiple responsibilities
export class AgentCube {
  rows: number;
  columns: number;
  layers: number;
  cellSize: number;
  grid: Array<Array<Array<Array<Agent>>>>;
  agentHovered: Agent | null;
  agentSelected: Agent | null;
  agentDragged: Agent | null;
  raycaster: Raycaster;
  mouseMove: Vector2;
  mouseWasMoved: boolean;
  mouseClick: Vector2;
  mouseWasClicked: boolean;
  container!: HTMLElement;
  scene!: Scene;
  camera!: AgentCamera;
  renderer!: WebGLRenderer;
  foundationHoverShape!: LineSegments;
  foundationSurface!: Mesh;
  touchMomentumHandler: Function | null;
  toolRow: number;
  toolColumn: number;

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
    this.agentDragged = null;
    this.raycaster = new Raycaster();
    this.mouseMove = new Vector2();
    this.mouseWasMoved = false;
    this.mouseClick = new Vector2();
    this.mouseWasClicked = false;
    this.touchMomentumHandler = null;
    this.toolRow = -1;
    this.toolColumn = -1;
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
    this.scene.background = new Color(0xaaaaaa);

    //  camera
    const fov = 35;
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const near = 10; // set to max to avoid z-buffer fights
    const far = 8000;

    this.camera = new AgentCamera(fov, aspect, near, far);
    this.camera.aim(200, -400, 600, 200, 400, 0);
    // this.camera.position.set(300, 400, 500);
    // this.camera.lookAt(0, 0, 0);

    // lights
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const spotLight = new DirectionalLight(0xffffff, 1.0);
    spotLight.position.set(100, -100, 100);
    this.scene.add(spotLight.target);

    // spotLight.target.position.set(50, 50, -4);
    spotLight.castShadow = false;
    // spotLight.shadow.radius = 8;

    // pointLight.shadow.bias = -0.0001;
    // super sensitive: a bit too large and an iPhone 11 will kick into 10x slower
    // spotLight.shadow.mapSize.width = 8 * 512; // 1024 * 8;
    // spotLight.shadow.mapSize.height = 8 * 512; // 1024 * 8;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 2500;

    spotLight.shadow.camera.left = 0;
    spotLight.shadow.camera.right = this.cellSize * this.columns * 1.2;
    spotLight.shadow.camera.top = 0;
    spotLight.shadow.camera.bottom = this.cellSize * this.rows * 1.2;

    spotLight.shadow.camera.updateProjectionMatrix();

    this.scene.add(spotLight);

    // helpers
    /*
    const lightHelper = new DirectionalLightHelper(spotLight);
    this.scene.add(lightHelper);

    const cameraHelper = new CameraHelper(spotLight.shadow.camera);
    this.scene.add(cameraHelper);
 */

// renderer
    this.renderer = new WebGLRenderer({antialias: true, alpha: false, logarithmicDepthBuffer: false});
    this.renderer.sortObjects = false; // to work with disabled depth testing
    this.renderer.setClearColor(0xff0000, 0);
    this.renderer.autoClear = true;
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

// shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = BasicShadowMap;

    this.container.appendChild(this.renderer.domElement);

    const axesHelper = new AxesHelper(100);
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
    const foundationGrid = new FoundationGrid(geometry, material);
    this.scene.add(foundationGrid);
  }

  // FIXME: Function is async but doesn't communicate this fact
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
        this.foundationSurface = new FoundationSurface(
          new PlaneGeometry(this.columns * this.cellSize, this.rows * this.cellSize),
          new MeshPhongMaterial({map: texture})
        );
        this.foundationSurface.position.x = 0.5 * this.columns * this.cellSize;
        this.foundationSurface.position.y = 0.5 * this.rows * this.cellSize;
        // this.foundationSurface.position.z = -50.0;
        this.foundationSurface.userData.isFoundation = true;
        this.foundationSurface.receiveShadow = true;
        this.scene.add(this.foundationSurface);
      },
      undefined,
      // eslint-disable-next-line handle-callback-err
      err => console.error("cannot load texture", err)
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
    const geometry = new BufferGeometry().setFromPoints(points);
    this.foundationHoverShape = new FoundationHover(geometry, material);
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
    const selectedAgent = app.uiState.selectedAgentClass;
    if (selectedAgent != null) {
    }
  }

  hoverAt(row: number, column: number, layer = 0) {
    this.foundationHoverShape.position.x = column * this.cellSize;
    this.foundationHoverShape.position.y = row * this.cellSize;
  }

  agentAtTop(row: number, column: number, layer = 0) {
    const agents = this.grid[layer][row][column];
    return agents[agents.length - 1];
  }

  pushAgent(agent: Agent, row: number, column: number, layer = 0) {
    // if (row === -1 || column === -1) return; // this should never happen

    if (agent.shape.mesh.parent == null) {
      this.scene.add(agent.shape.mesh);
    }
    const agents = this.grid[layer][row][column];
    const agentAtTop = this.agentAtTop(row, column, layer);

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
    if (removeFromScene && mesh.parent != null) {
      mesh.parent.remove(agent.shape.mesh);
    }

    const stack = this.grid[agent.layer][agent.row][agent.column];
    const index = stack.indexOf(agent);
    if (index > -1) {
      stack.splice(index, 1);
    }

    // adjust z values of all the agents that used to be above me
    for (let i = index; i < stack.length; i++) {
      stack[i].z -= agent.depth;
    }
  }

  /**
   *
   * Returns the first agent found at the given coordinates. If an agent is found, row, column belgon to this agent.
   * Else, row, column represents the mapped coordinates.
   *
   * @param x mouse
   * @param y mouse
   * @param excludedClasses
   */
  findAgentAt(x: number, y: number, excludedClasses: Array<string> = ["SelectionBox", "FoundationHover"]): FindAgentResult {
    this.raycaster.setFromCamera(new Vector2(x, y), this.camera);
    const intersections = this.raycaster.intersectObjects(this.scene.children, false);
    // console.log("intersections", intersections.map(inter => inter.object.constructor.name));
    const firstIntersection = intersections.filter(intersection => !excludedClasses.includes(intersection.object.constructor.name))[0];
    const hit: FindAgentResult = {agent: null, row: -1, column: -1};
    if (firstIntersection) {
      // FIXME: This schecks if the function isFoundation is present and not if it returns true/false. Is this correct?
      if (firstIntersection.object.userData.isFoundation) {
        hit.row = Math.floor(firstIntersection.point.y / this.cellSize);
        hit.column = Math.floor(firstIntersection.point.x / this.cellSize);
        // Heuristic: if we find an agent in that cell use it; May not work well in a tall stack
        hit.agent = this.agentAtTop(hit.row, hit.column);
      } else {
        hit.agent = findObjectAgent(firstIntersection.object);
        if (hit.agent) {
          hit.row = hit.agent.row;
          hit.column = hit.agent.column;
        }
      }
    }
    if (hit.agent) {
      // console.log("hit:", hit.agent.shapeName);
    } else {
      // console.log("hit:", hit);
    }
    return hit;
  }

  processMouseMove() {
    if (this.mouseWasMoved) {
      const hitResult = this.findAgentAt(this.mouseMove.x, this.mouseMove.y);
      const tool = app.uiState.selectedTool;
      if (tool != null) {
        tool.executeMove(hitResult);
      }
      this.mouseWasMoved = false;
    }
  }

  processMouseClick() {
    if (this.mouseWasClicked) {
      const tool = app.uiState.selectedTool;
      if (tool != null) {
        const hitResult = this.findAgentAt(this.mouseClick.x, this.mouseClick.y);
        tool.executeClick(hitResult);
      }
      this.mouseWasClicked = false;
    }
  }

  processTouchMomentum() {
    // if there is a handler function call it to deal with potential touch wrap up
    if (this.touchMomentumHandler) {
      this.touchMomentumHandler();
    }
  }

  render() {
    this.processMouseMove();
    this.processMouseClick();
    this.processTouchMomentum();
    // console.time("render");
    this.renderer.render(this.scene, this.camera);
    // console.timeEnd("render");
  }

  animate() {
    requestAnimationFrame(app.agentCube.animate);
    this.renderer.render(this.scene, this.camera);
  }

  addToScene(object3D: Object3D) {
    this.scene.add(object3D);
  }
}
