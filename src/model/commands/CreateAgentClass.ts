import {Command} from "@/model/Command";
import {WORLD_CONTEXT_ID} from "@/model/Commands";
import {AgentDescription} from "@/engine/agent/AgentDescription";
import {AgentCube} from "@/engine/AgentCube";
import {DestroyAgent} from "@/model/commands/DestroyAgent";

export class CreateAgentClass implements Command {
  contextId = WORLD_CONTEXT_ID;
  private readonly description: AgentDescription;
  private readonly agentCube: AgentCube;

  constructor(agentCube: AgentCube, agentDescription: AgentDescription) {
    this.description = agentDescription;
    this.agentCube = agentCube;
  }

  execute(): Command {
    this.agentCube.repository.add(this.description);
    return new DestroyAgent(this.agentCube, this.description);
  }
}
