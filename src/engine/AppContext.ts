import {AgentCube} from "@/engine/AgentCube";
import {UndoManager} from "@/model/UndoManager";
import {Gallery} from "@/engine/Gallery";
import {AgentRepository} from "@/engine/agent/AgentRepository";
import {AgentDescription} from "@/engine/agent/AgentDescription";
import {Tool} from "@/engine/tool/Tool";
import {DesignToolbar} from "@/components/hud/tab/design/DesignToolbar";

/**
 * Represents global UI state. This class is used as a bridge between Vue (UI framework) and the engine.
 */
export class UiState {
  selectedAgentClass?: AgentDescription;
  selectedTool?: Tool;
}

/**
 * Manages global state
 */
export class AppContext {
  name = "Cyber Collage";
  agentCube = new AgentCube(100, 100);
  gallery?: Gallery;
  undoManager = new UndoManager();
  repository = new AgentRepository();
  uiState = new UiState();
  // FIXME: Move this
  designToolbar = new DesignToolbar();

  agentType() {
    const e: any = document.getElementById("agent-menu");
    return e.options[e.selectedIndex].value;
  }

  tool() {
    return "pen";
    // const e: any = document.getElementById("tool-mode");
    // return e.options[e.selectedIndex].value;
  }
}
