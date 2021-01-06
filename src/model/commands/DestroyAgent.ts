import {Command} from "@/model/Command";
import {WORLD_CONTEXT_ID} from "@/model/Commands";
import {CreateAgentClass} from "@/model/commands/CreateAgentClass";
import {AgentClass} from "@/engine/agent/AgentClass";
import {AgentRepository} from "@/engine/agent/AgentRepository";

export class DestroyAgent implements Command {
  contextId = WORLD_CONTEXT_ID;
  timeStamp: number = new Date().valueOf();

  private readonly agentClassRepository: AgentRepository;
  private readonly description: AgentClass;

  constructor(agentClassRepository: AgentRepository, description: AgentClass) {
    this.agentClassRepository = agentClassRepository;
    this.description = description;
  }

  execute(): Command {
    this.agentClassRepository.remove(this.description);
    return new CreateAgentClass(this.agentClassRepository, this.description);
  }

  equals(command: Command): boolean {
    if (!(command instanceof DestroyAgent)) return false;
    return this.description === command.description;
  }
}
