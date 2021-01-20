import {ref} from "vue";
import {Tool} from "@/engine/tool/Tool";
import {app} from "@/engine/app";
import {AppContext} from "@/engine/AppContext";
import {AgentClass} from "@/engine/agent/AgentClass";
import {UndoManager} from "@/model/UndoManager";

type ClassStoreEntry = { name: string; shapeId: string };
type WorldEntry = { agentClass: string; column: number; row: number; layer: number };
type ProjectData = { classStore: Array<ClassStoreEntry>; worldData: Array<WorldEntry> };

export class SaveTool implements Tool {
  static loadState(): void {
    const data = localStorage.getItem("project");
    if (data == null || data === "") {
      return;
    }

    if (SaveTool.app().gallery == null) {
      return;
    }

    const obj: ProjectData = JSON.parse(data);
    const gallery = SaveTool.app().gallery;
    if (gallery == null) {
      return;
    }

    // Access vue proxy, so we can update the array and all the corresponding components update themself
    const agentClassArray = ref(SaveTool.app().repository.agentClasses);
    obj.classStore.forEach((it: ClassStoreEntry) => {
      const shape = gallery.findShape(it.shapeId);
      if (shape != null) {
        agentClassArray.value.push(new AgentClass(shape, it.name));
      } else {
        console.warn(`Could not find shape: ${it.shapeId}`);
      }
    });

    obj.worldData.forEach((it: WorldEntry) => {
      const agent = SaveTool.app().repository.getClass(it.agentClass).createAgent();
      SaveTool.app().agentCube.pushAgent(agent, parseInt(it.row as never), parseInt(it.column as never), parseInt(it.layer as never));
    });

    const uiStateData = ref(app.uiState);
    uiStateData.value.selectedAgentClass = app.repository.agentClasses[0];
  }

  static app(): AppContext {
    return app;
  }

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
    SaveTool.saveState();
    app.uiState.selectedTool = app.toolbar.getTool(previousSelectedToolId);
  }

  static registerListener(undoManager: UndoManager) {
    undoManager.addListener(() => {
      SaveTool.saveState();
    });
  }

  private static saveState() {
    function getClassStore(): Array<ClassStoreEntry> {
      return SaveTool.app().repository.agentClasses.map((it) => ({
        name: it.name,
        shapeId: it.shape.id,
      }));
    }

    function getWorldData(): Array<WorldEntry> {
      const result: Array<WorldEntry> = [];
      SaveTool.app().agentCube.broadcastGeometrically(it => {
        const obj = {
          layer: it.layer,
          row: it.row,
          column: it.column,
          agentClass: it.agentClass.name,
        };
        result.push(obj);
      });

      return result;
    }

    const obj = {
      classStore: getClassStore(),
      worldData: getWorldData(),
    };
    localStorage.setItem("project", JSON.stringify(obj));
  }
}
