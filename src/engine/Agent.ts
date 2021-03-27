// ***************************************************
// A G E N T
// ***************************************************

import {app} from "@/engine/app";
import {Box3, BoxHelper, Vector3} from "three";
import {hoverBoxColor, selectionBoxColor} from "@/engine/globals";
import {Shape} from "@/engine/Shape";
import {AgentCube} from "@/engine/AgentCube";
import {AgentClass} from "@/engine/agent/AgentClass";
import {GridVector} from "@/model/util/GridVector";

class SelectionBox extends BoxHelper {

}

export class Agent {
  static get app() {
    return app;
  }

  shape: Shape;
  row: number;
  layer: number;
  column: number;
  depth: number;
  private readonly hoverBox: SelectionBox;
  private readonly selectionBox: SelectionBox;
  rotationSpeed: Vector3 = new Vector3();
  parent!: AgentCube;
  readonly agentClass: AgentClass;
  tapped = false;

  constructor(shapeName: string, agentClass: AgentClass) {
    if (this.app.gallery == null) {
      throw new Error("Gallery not ready, system cannot be used");
    }

    this.row = 0;
    this.column = 0;
    this.layer = 0;
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

    // Selection and Hovering
    this.whenCreatingNewAgent();
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

  whenCreatingNewAgent() { /*
    this.rotationSpeed.x = 0.1 * (Math.random() - 0.5);
    this.rotationSpeed.y = 0.1 * (Math.random() - 0.5);
    this.rotationSpeed.z = 0.1 * (Math.random() - 0.5); */
    // default rotation
    // this.roateTo(Math.PI * -0.5, Math.PI * 1.0, 0);
  }

  draw() {
    console.log(`drawing agent: ${this.shape.id} @[${this.row}, ${this.column}]`);
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
  isValidCoordinate(row: number, column: number, layer = 0) {
    return !(row < 0 ||
      row >= this.parent.map.rows ||
      column < 0 ||
      column >= this.parent.map.columns ||
      layer < 0 ||
      layer >= this.parent.map.layers);
  }

  agentRelative(deltaRow: number, deltaColumn: number, deltaLayer = 0) {
    // return agent or null
    const row = this.row + deltaRow;
    const column = this.column + deltaColumn;
    const layer = this.layer + deltaLayer;

    // console.log(`accessing row, column, layer: ${row}, ${column}, ${layer}`)
    if (!this.isValidCoordinate(row, column, layer)) return null;
    const agents = this.parent.map.grid[layer][row][column];
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
    const row = this.row + deltaRow;
    const column = this.column + deltaColumn;
    const layer = this.layer + deltaLayer;
    if (!this.isValidCoordinate(row, column, layer)) return false;
    // console.log(app.agentCube.grid[layer][row][column].length);
    return this.parent.map.grid[layer][row][column].length === 0;
  }

  // A C T I O N S
  move(deltaRow: number, deltaColumn: number, deltaLayer = 0) {
    const row = this.row + deltaRow;
    const column = this.column + deltaColumn;
    const layer = this.layer + deltaLayer;
    if (!this.isValidCoordinate(row, column, layer)) return;
    this.removeFromMap();
    app.agentCube.pushAgent(this, row, column, layer);
  }

  teleportTo(position: GridVector) {
    if (!this.isValidCoordinate(position.row, position.column, position.layer)) {
      return;
    }
    this.app.agentCube.removeAgent(this, false);
    this.app.agentCube.pushAgent(this, position.row, position.column, position.layer);
  }

  moveRandom() {
    const max = 1;
    const min = -1;
    const deltaRow = Math.floor(Math.random() * (max - min + 1)) + min;
    const deltaColumn = Math.floor(Math.random() * (max - min + 1)) + min;
    // ignore layers for now
    if (this.isValidCoordinate(this.row + deltaRow, this.column + deltaColumn)) {
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

    const row = this.row + deltaRow;
    const column = this.column + deltaColumn;
    const layer = this.layer + deltaLayer;
    const newAgent = new Agent(agentClassName, agentClass);
    app.agentCube.pushAgent(newAgent, row, column, layer);
  }

  getPosition(): GridVector {
    return new GridVector(this.column, this.row, this.layer);
  }

  getTappedStateAndReset(): boolean {
    const value = this.tapped;
    this.tapped = false;
    return value;
  }
}
