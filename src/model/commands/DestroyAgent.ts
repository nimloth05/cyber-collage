import {Command} from "@/model/Command";
import {WORLD_CONTEXT_ID} from "@/model/Commands";
import {CreateAgentClass} from "@/model/commands/CreateAgentClass";
import {AgentCube} from "@/engine/AgentCube";
import {AgentDescription} from "@/engine/agent/AgentDescription";

export class DestroyAgent implements Command {
  contextId = WORLD_CONTEXT_ID;

  private readonly agentCube: AgentCube;
  private readonly description: AgentDescription;

  constructor(agentCube: AgentCube, description: AgentDescription) {
    this.agentCube = agentCube;
    this.description = description;
  }

  execute(): Command {
    this.agentCube.repository.remove(this.description);
    return new CreateAgentClass(this.agentCube, this.description);
  }
}
