import {AgentCube, GameLoop} from "@/engine/AgentCube";
import {UndoManager} from "@/model/UndoManager";
import {Gallery} from "@/engine/Gallery";
import {AgentRepository} from "@/engine/agent/AgentRepository";
import {AgentClass} from "@/engine/agent/AgentClass";
import {Tool} from "@/engine/tool/Tool";
import {PenTool} from "@/engine/tool/PenTool";
import {DesignToolbar} from "@/components/hud/tab/design/DesignToolbar";

/**
 * Represents global UI state. This class is used as a bridge between Vue (UI framework) and the engine.
 */
export class UiState {
  selectedAgentClass?: AgentClass;
  selectedTool: Tool = new PenTool();
  undoRedo: { canUndo: boolean; canRedo: boolean } = {canUndo: false, canRedo: false};
}

/**
 * Manages global state
 */
export class AppContext {
  name = "Cyber Collage";
  agentCube = new AgentCube(20, 20);
  gallery?: Gallery;
  uiState = new UiState();
  undoManager = new UndoManager();
  repository = new AgentRepository();
  toolbar = new DesignToolbar();
  gameLoop = new GameLoop();
}
