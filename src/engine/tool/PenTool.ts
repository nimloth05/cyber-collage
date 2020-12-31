import {FindAgentResult} from "@/engine/AgentCube";
import {app} from "@/engine/app";
import {AbstractAgentTool} from "@/engine/tool/AbstractAgentTool";
import {AddAgentToWorldCommand} from "@/model/commands/AddAgentToWorld";
import {GridVector} from "@/model/util/GridVector";

export class PenTool extends AbstractAgentTool {
  id = "pen";
  icon = "";
  name = "Stift"; // FIXME: Translate

  executeClick(hitResult: FindAgentResult): void {
    console.log("push agent PEN down");
    this.toolRow = hitResult.row;
    this.toolColumn = hitResult.column;
    const selectedAgentClass = app.uiState.selectedAgentClass;
    if (selectedAgentClass != null) {
      app.undoManager.execute(new AddAgentToWorldCommand(selectedAgentClass.createAgent(), new GridVector(hitResult.column, hitResult.row, 0)));
    }
  }

  executeMove(hitResult: FindAgentResult): void {
    if (hitResult.row !== this.toolRow || hitResult.column !== this.toolColumn) {
      this.toolRow = hitResult.row;
      this.toolColumn = hitResult.column;
      const selectedAgentClass = app.uiState.selectedAgentClass;
      if (selectedAgentClass != null) {
        app.undoManager.execute(new AddAgentToWorldCommand(selectedAgentClass.createAgent(), new GridVector(hitResult.column, hitResult.row, 0)));
      }
    }
  }
}
