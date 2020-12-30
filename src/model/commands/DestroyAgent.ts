import {Command} from "@/model/Command";
import {WORLD_CONTEXT_ID} from "@/model/Commands";
import {CreateAgentClass} from "@/model/commands/CreateAgentClass";
import {AgentDescription} from "@/engine/agent/AgentDescription";
import {AgentRepository} from "@/engine/agent/AgentRepository";

export class DestroyAgent implements Command {
  contextId = WORLD_CONTEXT_ID;

  private readonly agentClassRepository: AgentRepository;
  private readonly description: AgentDescription;

  constructor(agentClassRepository: AgentRepository, description: AgentDescription) {
    this.agentClassRepository = agentClassRepository;
    this.description = description;
  }

  execute(): Command {
    this.agentClassRepository.remove(this.description);
    return new CreateAgentClass(this.agentClassRepository, this.description);
  }
}
