import {AbstractAgentTool} from "@/engine/tool/AbstractAgentTool";
import {Agent} from "@/engine/Agent";
import {app} from "@/engine/app";
import {GridVector} from "@/model/util/GridVector";
import {TeleportCommand} from "@/model/commands/TeleportCommand";
import {ref} from "vue";
import {Vector2} from "three";

export class ArrowTool extends AbstractAgentTool {
  id = "arrow";
  icon = "img/tab/hand-pointer.svg";
  name = "Verschieben"; // FIXME: Translate

  // Cache which agent was selected last time. This field can get absolute if the agent was removed from the map/scene.
  private lastSelectedAgent?: Agent | null;
  private draggedAgent?: Agent | null;

  get selectedAgent(): Agent | null {
    return this.lastSelectedAgent?.isSelected ? this.lastSelectedAgent : null;
  }

  executeClick(click: Vector2): void {
    // select agent
    const hitResult = this.getHitResult(click);

    if (hitResult.agent !== this.selectedAgent) {
      if (this.selectedAgent) {
        this.selectedAgent.deselect();
        this.lastSelectedAgent = null;
      }
      if (hitResult.agent != null) {
        hitResult.agent.select();
        this.lastSelectedAgent = hitResult.agent;
        const uiState = ref(app.uiState);
        uiState.value.selectedAgentClass = hitResult.agent.agentClass;
      }
    }
    // start drag
    if (hitResult.agent != null) {
      this.draggedAgent = hitResult.agent;
    }
  }

  executeMove(move: Vector2): void {
    const agentDragged = this.draggedAgent;

    const hitResult = this.getHitResult(move, agentDragged);
    if (hitResult.row === -1 || hitResult.column === -1) return;

    if (agentDragged != null) {
      if (hitResult.row === agentDragged.gridPosition.row && hitResult.column === agentDragged.gridPosition.column) {
        return;
      }

      if (hitResult.row !== this.toolRow || hitResult.column !== this.toolColumn) {
        app.undoManager.execute(new TeleportCommand(agentDragged, new GridVector(hitResult.column, hitResult.row)));
        this.toolRow = hitResult.row;
        this.toolColumn = hitResult.column;
      }
    }
    // Hovering: does not work on touch interfaces
    /*
    if (!agent) this.hoverAt(row, column);
    if (agent !== this.agentHovered) {
      if (this.agentHovered) {
        this.agentHovered.unhover();
        this.agentHovered = null;
      }
      if (agent) {
        (agent as any).hover(); // TS!#$
        this.agentHovered = agent;
      }
    } */
  }

  executePointerUp() {
    this.draggedAgent = null;
  }
}
