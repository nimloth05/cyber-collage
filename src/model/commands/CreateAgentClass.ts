import {Command} from "@/model/Command";
import {WORLD_CONTEXT_ID} from "@/model/Commands";
import {AgentDescription} from "@/engine/agent/AgentDescription";
import {DestroyAgent} from "@/model/commands/DestroyAgent";
import {AgentRepository} from "@/engine/agent/AgentRepository";

export class CreateAgentClass implements Command {
  contextId = WORLD_CONTEXT_ID;
  timeStamp: number = new Date().valueOf();

  private readonly description: AgentDescription;
  private readonly agentClassRepository: AgentRepository;

  constructor(agentClassRepository: AgentRepository, agentDescription: AgentDescription) {
    this.description = agentDescription;
    this.agentClassRepository = agentClassRepository;
  }

  execute(): Command {
    this.agentClassRepository.add(this.description);
    return new DestroyAgent(this.agentClassRepository, this.description);
  }

  equals(command: Command): boolean {
    if (!(command instanceof CreateAgentClass)) return false;
    return this.description === command.description;
  }
}
