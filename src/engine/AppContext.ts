import {AgentCube} from "@/engine/AgentCube";
import {UndoManager} from "@/model/UndoManager";
import {Gallery} from "@/engine/Gallery";
import {AgentRepository} from "@/engine/agent/AgentRepository";

/**
 * Manages global state
 */
export class AppContext {
  name = "Cyber Collage";
  agentCube = new AgentCube(100, 100);
  gallery?: Gallery;
  undoManager = new UndoManager();
  repository = new AgentRepository();
}
