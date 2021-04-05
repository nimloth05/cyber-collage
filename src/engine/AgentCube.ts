/* eslint-disable comma-dangle */
//* **************************************************

import {Object3D, Vector2} from "three";
import {app} from "@/engine/app";
import {findObjectAgent} from "@/engine/helperfunctions.ts";
import {Agent} from "@/engine/Agent";
import {AgentMap} from "@/engine/Map";
import {Renderer} from "@/engine/Renderer";
import {ArrowTool} from "@/engine/tool/ArrowTool";

export class GameLoop {
  running = false;

  get isRunning(): boolean {
    return this.running;
  }

  toggleState(): boolean {
    return (this.running = !this.running);
  }

  start() {
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
  mouseMove: Vector2;
  mouseWasMoved: boolean;
  mouseClick: Vector2;
  mouseWasClicked: boolean;
  touchMomentumHandler: Function | null;
  map: AgentMap;
  renderer: Renderer;
  sensors = {
    alpha: 0,
    beta: 0,
    gamma: 0
  };

  registered = false;

  constructor(rows = 9, columns = 16, layers = 1, cellSize = 20.0) {
    this.map = new AgentMap(rows, columns, layers, cellSize);
    // this.shape = null;
    this.agentHovered = null;
    this.mouseMove = new Vector2();
    this.mouseWasMoved = false;
    this.mouseClick = new Vector2();
    this.mouseWasClicked = false;
    this.touchMomentumHandler = null;
    this.renderer = new Renderer();
  }

  init3DSystem() {
    this.renderer.initTHREE(this.map.rowsInRenderSpace, this.map.columnsInRenderSpace);
    this.map.addFoundationHover();
    this.map.addFoundationSurface();
    this.map.addToScene(this.renderer.scene);
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
  findAgentAt(x: number, y: number, excludedAgent: Agent | null = null, excludedClasses: Array<string> = ["SelectionBox", "FoundationHover"]): FindAgentResult {
    const intersections = this.renderer.getIntersections(x, y);

    const interestingObjects = intersections
      .filter(intersection => {
        return !(excludedClasses.includes(intersection.object.constructor.name) ||
          (excludedAgent != null && excludedAgent === findObjectAgent(intersection.object)));
      });
    const firstIntersection = interestingObjects[0];

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

    return hit;
  }

  processMouseMove() {
    if (this.mouseWasMoved) {
      this.mouseWasMoved = false;

      const tool = app.uiState.selectedTool;
      if (tool != null && !app.gameLoop.isRunning) {
        tool.executeMove(this.mouseMove);
      }
    }
  }

  processMouseClick() {
    if (this.mouseWasClicked) {
      this.mouseWasClicked = false;

      const tool = app.uiState.selectedTool;
      if (tool != null && !app.gameLoop.isRunning) {
        tool.executeClick(this.mouseClick);
      } else {
        const result = this.findAgentAt(this.mouseClick.x, this.mouseClick.y);
        if (result.agent != null) {
          result.agent.tapped = true;
        }
      }
    }
  }

  processPointerUp() {
    // FIXME: Is actually asymectric how mouseClick and mouseMove is handled

    const tool = app.uiState.selectedTool;
    // FIXME: This is not very nice, but ATM only the arrow tools needs to handle up. The thing is,
    //  that click represents a touchDown and a touchUp and this is only a touchUp occurring after a certain amount of time.
    if (tool != null && !app.gameLoop.isRunning && tool instanceof ArrowTool) {
      tool.executePointerUp();
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
    this.renderer.render();
    // console.timeEnd("render");
  }

  addToScene(object3D: Object3D) {
    this.renderer.scene.add(object3D);
  }

  requestDeviceOrientationPermission(): Promise<void> {
    if (this.registered) {
      return Promise.resolve();
    }

    function handleOrientation(event: DeviceOrientationEvent) {
      app.agentCube.sensors.gamma = event.gamma ?? 0;
      app.agentCube.sensors.alpha = event.alpha ?? 0;
      app.agentCube.sensors.beta = event.beta ?? 0;
    }

    if (typeof DeviceMotionEvent.requestPermission === "function") {
      return DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        });
    } else {
      // handle regular non iOS 13+ devices
      window.addEventListener("deviceorientation", handleOrientation);
      return Promise.resolve();
    }
  }
}
