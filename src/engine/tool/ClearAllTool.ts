import {Tool} from "@/engine/tool/Tool";
import {FindAgentResult} from "@/engine/AgentCube";
import {app} from "@/engine/app";
import {ClearWorldCommand} from "@/model/commands/ClearWorldCommand";

export class ClearAllTool implements Tool {
  icon = "img/bin.svg";
  id = "clearAll";
  name = "Alles Löschen";

  executeClick(hitResult: FindAgentResult): void {
    // no op
  }

  executeMove(hitResult: FindAgentResult): void {
    // no op
  }

  selected(previousSelectedToolId: string): void {
    app.undoManager.execute(new ClearWorldCommand());
    app.uiState.selectedTool = app.toolbar.getTool(previousSelectedToolId);
  }
}
