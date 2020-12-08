import {UndoContextId} from "@/model/Command";
import {Agent} from "@/engine/Agent";

export const WORLD_CONTEXT_ID: UndoContextId = "world";

export class AgentFactory {
  static createAgent(name: string, shapeName: string): Agent {
    return new Agent(shapeName);
  }
}
