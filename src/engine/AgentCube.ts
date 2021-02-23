/* eslint-disable comma-dangle */
//* **************************************************

import {AgentCamera} from "@/engine/AgentCamera.ts";
import {
  AmbientLight,
  AxesHelper,
  BasicShadowMap,
  Color,
  DirectionalLight,
  Object3D,
  Raycaster,
  Scene, sRGBEncoding,
  Vector2,
  WebGLRenderer,
} from "three";
import {app} from "@/engine/app";
import {findObjectAgent} from "@/engine/helperfunctions.ts";
import {Agent} from "@/engine/Agent";
import {AgentMap} from "@/engine/Map";

export class GameLoop {
  running = false;

  play() {
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  update() {
    if (!this.running) {
      return;
    }
    app.agentCube.map.broadcast("step");
  }

  /**
   * Launches the animation and game loop.
   */
  run() {
    requestAnimationFrame(() => {
      this.run();
    });
    this.update();
    app.agentCube.render();
  }
}

// --------------------------------------
// Scene Edit Objects Classes
// --------------------------------------

export type FindAgentResult = { agent: Agent | null; row: number; column: number };

/**
 /* AgentCube
 /*   A 4D Matrix containing and managing agents
 /*   row, column, layer, stack
 **/
// FIXME: Code smell: Class has multiple responsibilities
export class AgentCube {
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
  touchMomentumHandler: Function | null;
  toolRow: number;
  toolColumn: number;
  map: AgentMap;

  constructor(rows = 9, columns = 16, layers = 1, cellSize = 20.0) {
    this.map = new AgentMap(rows, columns, layers, cellSize);
    // this.shape = null;
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
    this.map.addToScene(this.scene);
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
    this.camera.aim(200, -100, 300, 200, 100, 0);
    // this.camera.position.set(300, 400, 500);
    // this.camera.lookAt(0, 0, 0);

    // lights
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const spotLight = new DirectionalLight(0xffffff, 1.2);
    spotLight.position.set(50, -100, 300);
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
    spotLight.shadow.camera.right = this.map.cellSize * this.map.columns * 1.2;
    spotLight.shadow.camera.top = 0;
    spotLight.shadow.camera.bottom = this.map.cellSize * this.map.rows * 1.2;

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
    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: false,
      logarithmicDepthBuffer: false
    });
    // this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.physicallyCorrectLights = false; // we use phong shading )-:

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

  // addFoundationGrid() {
  //   const points = [];
  //   /// ignore layers for the moment
  //   for (let row = 0; row < this.rows + 1; row++) {
  //     points.push(new Vector3(0.0, row * this.cellSize, 0.0));
  //     points.push(new Vector3(this.columns * this.cellSize, row * this.cellSize, 0.0));
  //   }
  //   for (let column = 0; column < this.columns + 1; column++) {
  //     points.push(new Vector3(column * this.cellSize, 0.0, 0.0));
  //     points.push(new Vector3(column * this.cellSize, this.rows * this.cellSize, 0.0));
  //   }
  //   const material = new LineBasicMaterial({color: foundationGridColor});
  //   const geometry = new BufferGeometry().setFromPoints(points);
  //   const foundationGrid = new FoundationGrid(geometry, material);
  //   this.scene.add(foundationGrid);
  // }

  // FIXME: Function is async but doesn't communicate this fact
  addFoundationSurface() {
    this.map.addFoundationSurface();
  }

  addFoundationHover() {
    this.map.addFoundationHover();
  }

  pushAgent(agent: Agent, row: number, column: number, layer = 0) {
    this.map.pushAgent(agent, row, column, layer);
    agent.parent = this;
  }

  removeAgent(agent: Agent, removeFromScene = false) {
    this.map.removeAgent(agent, removeFromScene);
  }

  /**
   * Returns the first agent found at the given coordinates. If an agent is found, row, column belongs to this agent.
   * Else, row, column represents the mapped coordinates.
   */
  findAgentAt(x: number, y: number, excludedAgent: any = null, excludedClasses: Array<string> = ["SelectionBox", "FoundationHover"]): FindAgentResult {
    this.raycaster.setFromCamera(new Vector2(x, y), this.camera);
    const intersections = this.raycaster.intersectObjects(this.scene.children, true);
    // console.log("intersections", intersections.map(inter => inter.object.constructor.name));
    // console.log("intersections", intersections.map(inter => findObjectAgent(inter.object)));
    const firstIntersection = intersections.filter(intersection => !(excludedClasses.includes(intersection.object.constructor.name) ||
      (excludedAgent && excludedAgent === findObjectAgent(intersection.object))))[0];
    const hit: FindAgentResult = {agent: null, row: -1, column: -1};
    if (firstIntersection) {
      // FIXME: This schecks if the function isFoundation is present and not if it returns true/false. Is this correct?
      if (firstIntersection.object.userData.isFoundation) {
        const mapCoordinate = this.map.toMapCoordinate(firstIntersection.point);
        hit.row = mapCoordinate.row;
        hit.column = mapCoordinate.column;
        // Heuristic: if we find an agent in that cell use it; May not work well in a tall stack
        hit.agent = this.map.agentAtTop(hit.row, hit.column);
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
      this.mouseWasMoved = false;

      const hitResult = this.findAgentAt(this.mouseMove.x, this.mouseMove.y, this.agentDragged);
      if (hitResult.row === -1 || hitResult.column === -1) return;
      const tool = app.uiState.selectedTool;
      if (tool != null && !app.gameLoop.running) {
        tool.executeMove(hitResult);
      }
    }
  }

  processMouseClick() {
    if (this.mouseWasClicked) {
      this.mouseWasClicked = false;

      const tool = app.uiState.selectedTool;
      if (tool != null && !app.gameLoop.running) {
        const hitResult = this.findAgentAt(this.mouseClick.x, this.mouseClick.y);
        tool.executeClick(hitResult);
      }
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

  addToScene(object3D: Object3D) {
    this.scene.add(object3D);
  }
}
