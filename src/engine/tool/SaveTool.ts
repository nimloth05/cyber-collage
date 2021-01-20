import {Tool} from "@/engine/tool/Tool";
import {app} from "@/engine/app";
import {AppContext} from "@/engine/AppContext";
import {AgentClass} from "@/engine/agent/AgentClass";
import {UndoManager} from "@/model/UndoManager";

export class SaveTool implements Tool {
  static loadState(): void {
    const data = localStorage.getItem("project");
    if (data == null || data === "") {
      return;
    }

    if (SaveTool.app().gallery == null) {
      return;
    }

    const obj = JSON.parse(data);

    obj.classStore.forEach((it: any) => {
      const shape = SaveTool.app().gallery!.findShape(it.shapeId)!;
      SaveTool.app().repository.add(new AgentClass(shape, it.name));
    });

    obj.worldData.forEach((it: any) => {
      const agent = SaveTool.app().repository.getClass(it.agentClass).createAgent();
      SaveTool.app().agentCube.pushAgent(agent, parseInt(it.row), parseInt(it.column), parseInt(it.layer));
    });
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
    function getClassStore(): any {
      return SaveTool.app().repository.agentClasses.map((it) => ({
        name: it.name,
        shapeId: it.shape.id,
      }));
    }

    function getWorldData(): Array<any> {
      const result: Array<any> = [];
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
    console.log("dump world to local store", obj);
    localStorage.setItem("project", JSON.stringify(obj));
  }
}
