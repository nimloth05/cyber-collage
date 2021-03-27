import {FindAgentResult} from "@/engine/AgentCube";
import {app} from "@/engine/app";
import {AbstractAgentTool} from "@/engine/tool/AbstractAgentTool";
import {AddAgentToWorldCommand} from "@/model/commands/AddAgentToWorld";
import {GridVector} from "@/model/util/GridVector";
import {UndoManager} from "@/model/UndoManager";
import {UiState} from "@/engine/AppContext";
import {Vector2} from "three";

export class PenTool extends AbstractAgentTool {
  static get uiState(): UiState {
    return app.uiState;
  }

  static get undoManager(): UndoManager {
    return app.undoManager;
  }

  id = "pen";
  icon = "img/tab/pen.svg";
  name = "Stift";

  executeClick(click: Vector2): void {
    const hitResult = this.getHitResult(click);
    this.toolRow = hitResult.row;
    this.toolColumn = hitResult.column;
    if (hitResult.column < 0 || hitResult.row < 0) {
      return;
    }

    const selectedAgentClass = PenTool.uiState.selectedAgentClass;
    if (selectedAgentClass != null) {
      PenTool.undoManager.execute(new AddAgentToWorldCommand(selectedAgentClass.createAgent(), new GridVector(hitResult.column, hitResult.row, 0)));
    }
  }

  executeMove(move: Vector2): void {
    const hitResult = this.getHitResult(move);
    if (hitResult.row === -1 || hitResult.column === -1) return;

    if (hitResult.row !== this.toolRow || hitResult.column !== this.toolColumn) {
      this.toolRow = hitResult.row;
      this.toolColumn = hitResult.column;
      const selectedAgentClass = PenTool.uiState.selectedAgentClass;
      if (selectedAgentClass != null) {
        PenTool.undoManager.execute(new AddAgentToWorldCommand(selectedAgentClass.createAgent(), new GridVector(hitResult.column, hitResult.row, 0)));
      }
    }
  }
}
