import {AbstractAgentTool} from "@/engine/tool/AbstractAgentTool";
import {FindAgentResult} from "@/engine/AgentCube";
import {app} from "@/engine/app";
import {RemoveAgentFromWorld} from "@/model/commands/RemoveAgentFromWorld";

export class EraseTool extends AbstractAgentTool {
  id = "erase";
  icon = "";
  name = "Löschen"; // FIXME: Translate

  executeClick(hitResult: FindAgentResult): void {
    // erase hitResult.agent
    if (hitResult.agent != null) {
      app.undoManager.execute(new RemoveAgentFromWorld(hitResult.agent));
    }
  }

  executeMove(hitResult: FindAgentResult): void {
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
