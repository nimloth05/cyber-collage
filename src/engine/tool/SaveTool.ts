import {Tool} from "@/engine/tool/Tool";
import {app} from "@/engine/app";

export class SaveTool implements Tool {
  icon = "icons/tab/save.svg";
  id = "save";
  name = "Speichern"

  executeClick(): void {
    // This is empty
  }

  executeMove(): void {
    // This is empty
  }

  selected(previousSelectedToolId: string): void {
    console.log("dump world to local store");
    app.uiState.selectedTool = app.toolbar.getTool(previousSelectedToolId);
  }
}
