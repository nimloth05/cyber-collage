// ***************************************************
// A G E N T
// ***************************************************

import {app} from "@/engine/app";
import {Box3, BoxHelper, Vector3} from "three";
import {hoverBoxColor, selectionBoxColor} from "@/engine/globals";
import {Shape} from "@/engine/Shape";
import {AgentCube} from "@/engine/AgentCube";

class SelectionBox extends BoxHelper {

}

export class Agent {
  static get app() {
    return app;
  }

  shape: Shape;
  shapeName: string;
  row: number;
  layer: number;
  column: number;
  depth: number;
  private readonly hoverBox: SelectionBox;
  private readonly selectionBox: SelectionBox;
  isSelected = false;
  isHovered = false;
  rotationSpeed: Vector3 = new Vector3();
  parent!: AgentCube;

  constructor(shapeName: string) {
    this.row = 0;
    this.column = 0;
    this.layer = 0;
    this.shapeName = shapeName;
    this.shape = this.app.gallery!.createShapeForAgent(shapeName)!;

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

  whenCreatingNewAgent() {
    this.rotationSpeed.x = 0.1 * (Math.random() - 0.5);
    this.rotationSpeed.y = 0.1 * (Math.random() - 0.5);
    this.rotationSpeed.z = 0.1 * (Math.random() - 0.5);
    // default rotation
    this.roateTo(Math.PI * -0.5, Math.PI * 1.0, 0);
  }

  draw() {
    console.log(`drawing agent: ${this.shape.id} @[${this.row}, ${this.column}]`);
  }

  step() { // Step your behavior
    // console.log(`stepping agent: ${this.shapeName} @[${this.row}, ${this.column}]`);
    this.rotateBy(this.rotationSpeed.x);
  }

  mouseClick() {
    console.log(`clicked @ ${this.shape.id}`);
  }

  hover() {
    this.isHovered = true;
    this.parent.addToScene(this.hoverBox);
    this.hoverBox.update();
  }

  unhover() {
    this.isHovered = false;
    this.parent.scene.remove(this.hoverBox);
  }

  select() {
    console.log(`selected ${this.shape.id}`);
    this.isSelected = true;
    this.parent.addToScene(this.selectionBox);
    this.selectionBox.update();
  }

  deselect() {
    this.isSelected = false;
    this.parent.scene.remove(this.selectionBox);
  }

  // Queries
  isValidCoordinate(row: number, column: number, layer = 0) {
    return !(row < 0 ||
      row >= this.parent.rows ||
      column < 0 ||
      column >= this.parent.columns ||
      layer < 0 ||
      layer >= this.parent.layers);
  }

  agentRelative(deltaRow: number, deltaColumn: number, deltaLayer = 0) {
    // return agent or null
    const row = this.row + deltaRow;
    const column = this.column + deltaColumn;
    const layer = this.layer + deltaLayer;

    // console.log(`accessing row, column, layer: ${row}, ${column}, ${layer}`)
    if (!this.isValidCoordinate(row, column, layer)) return null;
    const agents = this.parent.grid[layer][row][column];
    const agent = agents[agents.length - 1];
    if (agent == null) {
      return null;
    } else {
      return agent;
    }
  }

  removeFromAgentCube() {
    const agents = app.agentCube.grid[this.layer][this.row][this.column];
    const index = agents.indexOf(this);
    if (index === -1) console.error(`cannot remove agent: ${this} from AgentCube`);
    agents.splice(index, 1);
    // adjust z values of all the agents that used to be above me
    for (let i = index; i < agents.length; i++) {
      agents[i].z -= this.depth;
    }
  }

  // C O N D I T I O N S
  see(shapeName: string, deltaRow: number, deltaColumn: number, deltaLayer = 0) {
    const agent = this.agentRelative(deltaRow, deltaColumn, deltaLayer);
    // console.log(`agent: ${agent}`);
    return (agent != null && agent.shape.id === shapeName);
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
    return app.agentCube.grid[layer][row][column].length === 0;
  }

  // A C T I O N S
  move(deltaRow: number, deltaColumn: number, deltaLayer = 0) {
    const row = this.row + deltaRow;
    const column = this.column + deltaColumn;
    const layer = this.layer + deltaLayer;
    if (!this.isValidCoordinate(row, column, layer)) return null;
    this.removeFromAgentCube();
    app.agentCube.pushAgent(this, row, column, layer);
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

  roateTo(deltaRoll = 0.0, deltaPitch = 0.0, deltaHeading = 0.0) {
    this.roll = deltaRoll;
    this.pitch = deltaPitch;
    this.heading = deltaHeading;
  }

  erase() {
    this.removeFromAgentCube();
    this.parent.scene.remove(this.shape.mesh);
  }
}
