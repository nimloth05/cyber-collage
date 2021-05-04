/**
 * Represents a map (world)
 */
import {
  BufferGeometry, Color,
  Group,
  LineBasicMaterial,
  MeshBasicMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  TextureLoader,
  Vector3,
} from "three";
import {FoundationHover, HelperMeshes} from "@/engine/HelperMeshes";
import {selectionBoxColor} from "@/engine/globals";
import {Agent} from "@/engine/Agent";
import {removeFromArray} from "@/util/util";
import {GridVector} from "@/model/util/GridVector";

export type GridArray = Array<Array<Array<Array<Agent>>>>;
export type MapSnapShot = { grid: GridArray; agents: Array<Agent> };

export class AgentMap {
  rows: number;
  columns: number;
  layers: number;
  cellSize: number;

  grid: GridArray;
  agentList: Array<Agent> = [];

  private readonly foundationGroup: Group;
  private readonly agentGroup: Group;
  private foundationSurface!: HelperMeshes;
  private foundationHoverShape!: FoundationHover;

  constructor(rows: number, columns: number, layers: number, cellSize: number) {
    this.rows = rows;
    this.columns = columns;
    this.layers = layers;
    this.cellSize = cellSize;

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

    this.foundationGroup = new Group();
    this.agentGroup = new Group();
  }

  getStack(position: GridVector): Array<Agent> {
    return this.grid[position.layer][position.row][position.column];
  }

  addFoundationSurface() {
    const texturePath = "textures/";
    const texturesFile = "chess_texture.png";
    const loader = new TextureLoader();
    // FIXME: Move this to an asset manager
    loader.load(
      `${texturePath}${texturesFile}`,
      texture => {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(Math.ceil(this.columns / 2), Math.ceil(this.rows / 2));
        this.foundationSurface = new HelperMeshes(
          new PlaneGeometry(this.columns * this.cellSize, this.rows * this.cellSize),
          new MeshBasicMaterial({
            map: texture,
            color: new Color(0xffffff),
          }),
        );
        this.foundationSurface.position.x = 0.5 * this.columns * this.cellSize;
        this.foundationSurface.position.y = 0.5 * this.rows * this.cellSize;
        // this.foundationSurface.position.z = -50.0;
        this.foundationSurface.userData.isFoundation = true;
        this.foundationSurface.receiveShadow = true;
        this.foundationGroup.add(this.foundationSurface);
      },
      undefined,
      // eslint-disable-next-line handle-callback-err
      err => console.error("cannot load texture", err),
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
    this.foundationGroup.add(this.foundationHoverShape);
  }

  pushAgent(agent: Agent, position: GridVector) {
    if (position.row === -1 || position.column === -1) return; // this should never happen

    if (agent.shape.mesh.parent == null) {
      this.agentGroup.add(agent.shape.mesh);
    }
    const agents = this.grid[position.layer][position.row][position.column];
    const agentAtTop = this.agentAtTop(position.row, position.column, position.layer);

    // adjust geometry
    // FIXME: If agent would be aware of the cell size it could calculate the correct coordinates by itself
    agent.x = position.column * this.cellSize + 0.5 * this.cellSize;
    agent.y = position.row * this.cellSize + 0.5 * this.cellSize;

    if (agentAtTop == null) {
      agent.z = position.layer * this.cellSize;
    } else {
      agent.z = agentAtTop.z + agentAtTop.depth;
    }

    // adjust topology
    agent.gridPosition = position;
    // adjust part hierarchy
    // update stack
    agents.push(agent);
    this.agentList.push(agent);
  }

  removeAgent(agent: Agent, removeFromScene = false) {
    const mesh = agent.shape.mesh;
    if (removeFromScene && mesh.parent != null) {
      mesh.parent.remove(agent.shape.mesh);
    }

    const stack = this.grid[agent.gridPosition.layer][agent.gridPosition.row][agent.gridPosition.column];
    const index = removeFromArray(stack, agent);

    removeFromArray(this.agentList, agent);

    // adjust z values of all the agents that used to be above me
    for (let i = index; i < stack.length; i++) {
      stack[i].z -= agent.depth;
    }
  }

  broadcast(methodName: string) {
    this.agentList.forEach((agent: any) => {
      const method = agent[methodName];
      if (method != null) {
        agent[methodName]();
      }
    });
  }

  broadcastGeometrically(handler: (agent: Agent) => void) {
    this.grid.forEach((layer) => {
      layer.forEach((row) => {
        row.forEach((column) => {
          column.forEach((agent: any) => {
            handler(agent);
          });
        });
      });
    });
  }

  hoverAt(row: number, column: number) {
    this.foundationHoverShape.position.x = column * this.cellSize;
    this.foundationHoverShape.position.y = row * this.cellSize;
  }

  agentAtTop(row: number, column: number, layer = 0) {
    const agents = this.grid[layer][row][column];
    return agents[agents.length - 1];
  }

  toMapCoordinate(worldSpace: Vector3): GridVector {
    return new GridVector(
      Math.floor(worldSpace.x / this.cellSize),
      Math.floor(worldSpace.y / this.cellSize),
    );
  }

  addToScene(scene: Scene) {
    scene.add(this.foundationGroup);
    scene.add(this.agentGroup);
  }

  createSnapShot(): MapSnapShot {
    const grid: GridArray = this.grid.map((layer) => {
      return layer.map((row) => {
        return row.map((column) => {
          return column.slice();
        });
      });
    });

    const agents = this.agentList.slice();
    return {
      grid,
      agents,
    };
  }

  applySnapShot(snapShot: MapSnapShot): void {
    this.agentGroup.clear();
    this.grid = snapShot.grid;
    this.agentList = snapShot.agents;

    // We have to re-add the given agent the correct position in the grid. The agent refers to its previous position.
    this.grid.forEach((layer, layerIndex) => {
      layer.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
          column.forEach((agent: Agent, stackIndex) => {
            agent.x = columnIndex * this.cellSize + 0.5 * this.cellSize;
            agent.y = rowIndex * this.cellSize + 0.5 * this.cellSize;
            agent.z = column
              .map(a => a.depth)
              .reduce((acc, depth, currentIndex) => currentIndex < stackIndex ? (acc + depth) : acc, 0);
            console.log(`agent.z (${agent.shapeName})`, agent.z);

            agent.gridPosition = new GridVector(columnIndex, rowIndex, layerIndex);
            this.agentGroup.add(agent.shape.mesh);
          });
        });
      });
    });
  }

  clearAll() {
    while (this.agentList.length > 0) {
      this.agentList[0].erase();
    }
  }

  get rowsInRenderSpace(): number {
    return this.cellSize * this.rows;
  }

  get columnsInRenderSpace(): number {
    return this.cellSize * this.columns;
  }
}
