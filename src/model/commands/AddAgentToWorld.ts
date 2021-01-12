import {Command} from "@/model/Command";
import {GridVector} from "@/model/util/GridVector";
import {app} from "@/engine/app";
import {WORLD_CONTEXT_ID} from "@/model/Commands";
import {RemoveAgentFromWorld} from "@/model/commands/RemoveAgentFromWorld";
import {AgentClass} from "@/engine/agent/AgentClass";
import {Agent} from "@/engine/Agent";

export class AddAgentToWorldCommand implements Command {
  contextId = WORLD_CONTEXT_ID;
  timeStamp: number = new Date().valueOf();
  private readonly agent: AgentClass | Agent;
  private readonly position: GridVector;

  constructor(description: AgentClass | Agent, position: GridVector) {
    this.agent = description;
    this.position = position;
  }

  execute(): Command {
    const agent = this.agent instanceof AgentClass ? this.agent.createAgent() : this.agent;
    app.agentCube.pushAgent(agent, this.position.row, this.position.column, this.position.layer);
    return new RemoveAgentFromWorld(agent);
  }

  equals(command: Command): boolean {
    if (!(command instanceof AddAgentToWorldCommand)) return false;
    return command.position.equals(command.position) && command.agent === this.agent;
  }
}
