import {Command} from "@/model/Command";
import {GridVector} from "@/model/util/GridVector";
import {app} from "@/engine/app";
import {WORLD_CONTEXT_ID} from "@/model/Commands";
import {RemoveAgentFromWorld} from "@/model/commands/RemoveAgentFromWorld";
import {AgentDescription} from "@/engine/agent/AgentDescription";
import {Agent} from "@/engine/Agent";

export class AddAgentToWorldCommand implements Command {
  contextId = WORLD_CONTEXT_ID;
  private readonly agent: AgentDescription | Agent;
  private readonly position: GridVector;

  constructor(description: AgentDescription | Agent, position: GridVector) {
    this.agent = description;
    this.position = position;
  }

  execute(): Command {
    const agent = this.agent instanceof AgentDescription ? this.agent.createAgent() : this.agent;
    app.agentCube.pushAgent(agent, this.position.row, this.position.column, this.position.layer);
    return new RemoveAgentFromWorld(agent);
  }
}
