import {ref} from "vue";
import {fromPairs} from "lodash";
import {Tool} from "@/engine/tool/Tool";
import {app} from "@/engine/app";
import {AppContext} from "@/engine/AppContext";
import {AgentClass} from "@/engine/agent/AgentClass";
import {UndoManager} from "@/model/UndoManager";
import {MethodList} from "@/engine/Instruction";
import {ClassStoreEntry, ProjectData, WorldEntry} from "@/engine/tool/SaveModel";
import {Vector2} from "three";

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
        const agentClass = new AgentClass(shape, it.name);
        agentClass.methods = MethodList.deserialize(it.methods);
        agentClassArray.value.push(agentClass);
      } else {
        console.warn(`Could not find shape: ${it.shapeId}`);
      }
    });

    obj.worldData.forEach((it: WorldEntry) => {
      const agentClass = SaveTool.app().repository.getClass(it.agentClass);
      if (agentClass != null) {
        const agent = agentClass.createAgent();
        SaveTool.app().agentCube.pushAgent(agent, parseInt(it.row as never), parseInt(it.column as never), parseInt(it.layer as never));
      }
    });

    const uiStateData = ref(app.uiState);
    uiStateData.value.selectedAgentClass = app.repository.agentClasses[0];
  }

  static app(): AppContext {
    return app;
  }

  icon = "img/tab/save.svg";
  id = "save";
  name = "Speichern"

  executeClick(click: Vector2): void {
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
      return SaveTool.app()
        .repository
        .agentClasses
        .map((it) => ({
          name: it.name,
          shapeId: it.shape.id,
          methods: fromPairs(it.methods.map(method => ([
              method.name, method.rules.map(rule => ({
                conditions: rule.conditions.map(condition => condition.toJson()),
                actions: rule.actions.map(condition => condition.toJson()),
              })),
            ]),
            ),
          ),
        } as ClassStoreEntry));
    }

    function getWorldData(): Array<WorldEntry> {
      const result: Array<WorldEntry> = [];
      SaveTool.app().agentCube.map.broadcastGeometrically(it => {
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

  static storeString(value: string) {
    localStorage.setItem("project", value);
    window.location.reload();
  }
}
