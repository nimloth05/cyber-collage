import {Command} from "@/model/Command";
import {Agent} from "@/engine/Agent";
import {GridVector} from "@/model/util/GridVector";
import {app} from "@/engine/app";
import {AddAgentToWorldCommand} from "@/model/commands/AddAgentToWorld";
import {WORLD_CONTEXT_ID} from "@/model/Commands";

export class RemoveAgentFromWorld implements Command {
  contextId = WORLD_CONTEXT_ID;
  timeStamp: number = new Date().valueOf();
  private readonly agent: Agent;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  execute(): Command {
    const position = new GridVector(this.agent.column, this.agent.row, this.agent.layer);
    app.agentCube.removeAgent(this.agent, true);
    return new AddAgentToWorldCommand(this.agent, position);
  }

  equals(command: Command): boolean {
    if (!(command instanceof RemoveAgentFromWorld)) return false;
    return this.agent === command.agent;
  }
}
