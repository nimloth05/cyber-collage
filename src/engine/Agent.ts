// ***************************************************
// A G E N T
// ***************************************************

import {app} from "@/engine/app";
import {Box3, BoxHelper} from "three";
import {hoverBoxColor, selectionBoxColor} from "@/engine/globals";
import {Shape} from "@/engine/Shape";
import {AgentCube} from "@/engine/AgentCube";
import {AgentClass} from "@/engine/agent/AgentClass";
import {GridVector} from "@/model/util/GridVector";
import {mapValue} from "@/util/util";
import {AxisType, AxisValue, OperatorType, OperatorValue} from "@/engine/instruction-value";

const FormulaParser = require("hot-formula-parser").Parser;

class SelectionBox extends BoxHelper {

}

export class Agent {
  static get app() {
    return app;
  }

  shape: Shape;
  depth: number;
  private readonly hoverBox: SelectionBox;
  private readonly selectionBox: SelectionBox;
  parent!: AgentCube;
  readonly agentClass: AgentClass;
  tapped = false;

  gridPosition = new GridVector(0, 0, 0);

  constructor(shapeName: string, agentClass: AgentClass) {
    if (this.app.gallery == null) {
      throw new Error("Gallery not ready, system cannot be used");
    }

    this.shape = this.app.gallery.createShapeForAgent(shapeName);

    this.agentClass = agentClass;

    // define shape as mesh and add clone of mesh to scene
    // NEED to check if this clone copies the geometry which is SHOULD NOT
    // use THREE.SkeletonUtils.clone instead? https://discourse.threejs.org/t/solved-issue-with-gltfloader-and-reusing-geometry/6697

    this.shape.mesh.userData = this; // need to be able to trace back shapes to agents

    // compute bounds
    const box = new Box3();
    box.setFromObject(this.shape.mesh);
    this.depth = box.max.z - box.min.z;

    // selection and hover boxes:
    // warn: it would be possible to share a single set of boxes reduce memory but this would not work if multiple selections will be allowed
    this.hoverBox = new SelectionBox(this.shape.mesh, hoverBoxColor);
    this.hoverBox.userData.agent = this;
    this.selectionBox = new SelectionBox(this.shape.mesh, selectionBoxColor);
    this.selectionBox.userData.agent = this;
  }

  get isSelected(): boolean {
    // This agent is selected, if the visual box is actually part of the scene.
    return this.selectionBox.parent != null;
  }

  get isHovered(): boolean {
    return this.hoverBox.parent != null;
  }

  get shapeName(): string {
    return this.shape.id;
  }

  get app() {
    return Agent.app;
  }

  // Getters & Setters
  get x() {
    return this.shape.mesh.position.x;
  }

  set x(x) {
    this.shape.mesh.position.x = x;
    if (this.isHovered) this.hoverBox.update();
    if (this.isSelected) this.selectionBox.update();
  }

  get y() {
    return this.shape.mesh.position.y;
  }

  set y(y) {
    this.shape.mesh.position.y = y;
    if (this.isHovered) this.hoverBox.update();
    if (this.isSelected) this.selectionBox.update();
  }

  get z() {
    return this.shape.mesh.position.z;
  }

  set z(z) {
    this.shape.mesh.position.z = z;
    if (this.isHovered) this.hoverBox.update();
    if (this.isSelected) this.selectionBox.update();
  }

  get roll() {
    return this.shape.mesh.rotation.z;
  }

  set roll(roll) {
    this.shape.mesh.rotation.z = roll;
    if (this.isHovered) this.hoverBox.update();
    if (this.isSelected) this.selectionBox.update();
  }

  get pitch() {
    return this.shape.mesh.rotation.y;
  }

  set pitch(pitch) {
    this.shape.mesh.rotation.y = pitch;
    if (this.isHovered) this.hoverBox.update();
    if (this.isSelected) this.selectionBox.update();
  }

  get heading() {
    return this.shape.mesh.rotation.x;
  }

  set heading(heading) {
    this.shape.mesh.rotation.x = heading;
    if (this.isHovered) this.hoverBox.update();
    if (this.isSelected) this.selectionBox.update();
  }

  step() { // Step your behavior
    // console.log(`stepping agent: ${this.shapeName} @[${this.row}, ${this.column}]`);
    // this.rotateBy(this.rotationSpeed.x);
  }

  mouseClick() {
    console.log(`clicked @ ${this.shape.id}`);
  }

  hover() {
    this.parent.addToScene(this.hoverBox);
    this.hoverBox.update();
  }

  unhover() {
    this.parent.renderer.scene.remove(this.hoverBox);
  }

  select() {
    console.log(`selected ${this.shape.id}`);
    this.parent.addToScene(this.selectionBox);
    this.selectionBox.update();
    // debugging!!
    console.log("selection box", this.selectionBox);
    this.selectionBox.geometry.computeBoundingBox();
  }

  deselect() {
    if (this.selectionBox.parent != null) {
      this.selectionBox.parent.remove(this.selectionBox);
    }
  }

  // Queries
  isValidCoordinate(gridPosition: GridVector) {
    return !(gridPosition.row < 0 ||
      gridPosition.row >= this.parent.map.rows ||
      gridPosition.column < 0 ||
      gridPosition.column >= this.parent.map.columns ||
      gridPosition.layer < 0 ||
      gridPosition.layer >= this.parent.map.layers);
  }

  agentRelative(deltaRow: number, deltaColumn: number, deltaLayer = 0) {
    const newPosition = this.gridPosition.add(deltaRow, deltaColumn, deltaLayer);

    // console.log(`accessing row, column, layer: ${row}, ${column}, ${layer}`)
    if (!this.isValidCoordinate(newPosition)) return null;
    const agents = this.parent.map.getStack(newPosition);
    const agent = agents[agents.length - 1];
    if (agent == null) {
      return null;
    } else {
      return agent;
    }
  }

  removeFromMap(removeFromScene = false) {
    this.parent.removeAgent(this, removeFromScene);
  }

  // C O N D I T I O N S
  see(shapeName: string, deltaRow: number, deltaColumn: number, deltaLayer = 0) {
    const agent = this.agentRelative(deltaRow, deltaColumn, deltaLayer);
    // console.log(`agent: ${agent}`);
    return (agent != null && agent.shape.id === shapeName);
  }

  seeAgent(agentClassName: string, deltaRow: number, deltaColumn: number, deltaLayer = 0): boolean {
    const agentClass = this.app.repository.getClass(agentClassName);
    if (agentClass == null) {
      return false;
    }

    return this.see(agentClass.shape.id, deltaRow, deltaColumn, deltaLayer);
  }

  percentChance(chance: number) {
    return (chance / 100.0 > Math.random());
  }

  empty(deltaRow: number, deltaColumn: number, deltaLayer = 0) {
    const newPosition = this.gridPosition.add(deltaRow, deltaColumn, deltaLayer);
    if (!this.isValidCoordinate(newPosition)) return false;
    return this.parent.map.getStack(newPosition).length === 0;
  }

  // A C T I O N S
  move(deltaRow: number, deltaColumn: number, deltaLayer = 0) {
    const newPosition = this.gridPosition.add(deltaRow, deltaColumn, deltaLayer);
    if (!this.isValidCoordinate(newPosition)) return;
    this.removeFromMap();
    app.agentCube.pushAgent(this, newPosition);
  }

  teleportTo(position: GridVector) {
    if (!this.isValidCoordinate(position)) {
      return;
    }
    this.app.agentCube.removeAgent(this, false);
    this.app.agentCube.pushAgent(this, position);
  }

  moveRandom() {
    const max = 1;
    const min = -1;
    const deltaRow = Math.floor(Math.random() * (max - min + 1)) + min;
    const deltaColumn = Math.floor(Math.random() * (max - min + 1)) + min;
    const newPosition = this.gridPosition.add(deltaRow, deltaColumn, 0);
    // ignore layers for now
    if (this.isValidCoordinate(newPosition)) {
      this.move(deltaRow, deltaColumn);
    }
  }

  rotateBy(deltaRoll = 0.0, deltaPitch = 0.0, deltaHeading = 0.0) {
    this.roll += deltaRoll;
    this.pitch += deltaPitch;
    this.heading += deltaHeading;
  }

  rotateTo(deltaRoll = 0.0, deltaPitch = 0.0, deltaHeading = 0.0) {
    this.roll = deltaRoll;
    this.pitch = deltaPitch;
    this.heading = deltaHeading;
  }

  erase() {
    this.deselect();
    this.removeFromMap(true);
  }

  createNew(agentClassName: string, deltaRow: number, deltaColumn: number, deltaLayer = 0) {
    if (this.app.gallery == null) {
      throw new Error("Gallery not ready, system cannot be used");
    }
    const agentClass = this.app.repository.getClass(agentClassName);
    if (agentClass == null) {
      return;
    }

    const newPosition = this.gridPosition.add(deltaRow, deltaColumn, deltaLayer);
    const newAgent = this.agentClass.createAgent();
    app.agentCube.pushAgent(newAgent, newPosition);
  }

  getTappedStateAndReset(): boolean {
    const value = this.tapped;
    this.tapped = false;
    return value;
  }

  playSound(id: string, pitchFormula: string): void {
    if (pitchFormula !== "") {
      // FIXME: This has to move somewhere else.
      // FIXME: Think about caching the parser.
      const parser = new FormulaParser();
      parser.setFunction("pitchBeta", () => {
        return mapValue(this.parent.sensors.beta, -180, 179, -7, 7);
      });
      parser.setFunction("pitchAlpha", () => {
        return mapValue(this.parent.sensors.alpha, 0, 359, -7, 7);
      });
      parser.setFunction("pitchGamma", () => {
        return mapValue(this.parent.sensors.gamma, 0, -90, 89, 7);
      });
      const parseResult = parser.parse(pitchFormula);
      if (parseResult.result != null && typeof parseResult.result === "number") {
        app.soundSystem.pitchShift(id, parseResult.result);
      }
    }
    app.soundSystem.playSound(id);
  }

  deviceOrientationCondition(axisValue: AxisType, operatorValue: OperatorType, value: string): boolean {
    const parser = new FormulaParser();
    parser.setFunction("alpha", () => {
      return this.parent.sensors.alpha;
    });
    parser.setFunction("beta", () => {
      return this.parent.sensors.beta;
    });
    parser.setFunction("gamma", () => {
      return this.parent.sensors.gamma;
    });
    const formula = `${axisValue}() ${operatorValue} (${value})`;
    console.log("formula", formula);
    const result = parser.parse(formula);
    return result.result != null && typeof result.result === "boolean" ? result.result : false;
  }
}
