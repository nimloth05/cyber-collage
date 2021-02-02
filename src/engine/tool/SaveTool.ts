import {ref} from "vue";
import {Tool} from "@/engine/tool/Tool";
import {app} from "@/engine/app";
import {AppContext} from "@/engine/AppContext";
import {AgentClass} from "@/engine/agent/AgentClass";
import {UndoManager} from "@/model/UndoManager";
import {Action, Condition, Method, Rule} from "@/engine/Instruction";
import {ClassStoreEntry, MethodEntry, ProjectData, RuleEntry, WorldEntry} from "@/engine/tool/SaveModel";
import {InstructionDefinitions, instructionDefinitions} from "@/engine/instruction-definitions";

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
        it.methods.forEach((methodEntry) => {
          Object.keys(methodEntry)
            .forEach(methodName => {
              const m = new Method();
              m.name = methodName;
              agentClass.methods.addMethod(m);
              methodEntry[methodName].forEach(ruleEntry => {
                const rule = new Rule();
                m.rules.add(rule);

                ruleEntry.actions.forEach(conditionEntry => {
                  const decl = InstructionDefinitions.findDefinition(conditionEntry.name);
                  if (decl == null) {
                    throw new Error(`No instruction declaration with name ${conditionEntry.name} found`);
                  }
                  const args = decl.deserialize(conditionEntry.arguments);
                  rule.addAction(new Action(decl, args));
                });

                ruleEntry.conditions.forEach(conditionEntry => {
                  const decl = InstructionDefinitions.findDefinition(conditionEntry.name);
                  if (decl == null) {
                    throw new Error(`No instruction declaration with name ${conditionEntry.name} found`);
                  }
                  const args = decl.deserialize(conditionEntry.arguments);
                  rule.addCondition(new Condition(decl, args));
                });
              });
            });
        });
        agentClassArray.value.push(agentClass);
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

  icon = "img/tab/save.svg";
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
      return SaveTool.app()
        .repository
        .agentClasses
        .map((it) => ({
          name: it.name,
          shapeId: it.shape.id,
          methods: it.methods.map(method => ({
            [method.name]: method.rules.map(rule => ({
              conditions: rule.conditions.map(condition => condition.toJson()),
              actions: rule.actions.map(condition => condition.toJson()),
            } as RuleEntry)),
          } as MethodEntry)),
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
}
