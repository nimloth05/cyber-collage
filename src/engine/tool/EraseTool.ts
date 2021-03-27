import {AbstractAgentTool} from "@/engine/tool/AbstractAgentTool";
import {FindAgentResult} from "@/engine/AgentCube";
import {app} from "@/engine/app";
import {RemoveAgentFromWorld} from "@/model/commands/RemoveAgentFromWorld";
import {Vector2} from "three";

export class EraseTool extends AbstractAgentTool {
  id = "erase";
  icon = "img/tab/erase.svg";
  name = "Löschen"; // FIXME: Translate

  executeClick(click: Vector2): void {
    // erase hitResult.agent
    const hitResult = this.getHitResult(click);

    if (hitResult.agent != null) {
      app.undoManager.execute(new RemoveAgentFromWorld(hitResult.agent));
    }
  }

  executeMove(move: Vector2): void {
    const hitResult = this.getHitResult(move);
    if (hitResult.row === -1 || hitResult.column === -1) return;

    // erase agent
    if (hitResult.agent) {
      if (hitResult.row !== this.toolRow || hitResult.column !== this.toolColumn) {
        app.undoManager.execute(new RemoveAgentFromWorld(hitResult.agent));
        this.toolRow = hitResult.row;
        this.toolColumn = hitResult.column;
      }
    } else {
      this.toolRow = hitResult.row;
      this.toolColumn = hitResult.column;
    }
  }
}
