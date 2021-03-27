import {Tool} from "@/engine/tool/Tool";
import {app} from "@/engine/app";
import {ClearWorldCommand} from "@/model/commands/ClearWorldCommand";

export class ClearAllTool implements Tool {
  icon = "img/bin.svg";
  id = "clearAll";
  name = "Alles Löschen";

  executeClick(): void {
    // no op
  }

  executeMove(): void {
    // no op
  }

  selected(previousSelectedToolId: string): void {
    app.undoManager.execute(new ClearWorldCommand());
    app.uiState.selectedTool = app.toolbar.getTool(previousSelectedToolId);
  }
}
