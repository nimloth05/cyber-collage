import {Command} from "@/model/Command";
import {Agent} from "@/engine/Agent";
import {GridVector} from "@/model/util/GridVector";
import {app} from "@/engine/app";
import {WORLD_CONTEXT_ID} from "@/model/Commands";
import {RemoveAgentFromWorld} from "@/model/commands/RemoveAgentFromWorld";

export class AddAgentToWorldCommand implements Command {
  contextId = WORLD_CONTEXT_ID;
  private readonly agent: Agent;
  private readonly position: GridVector;

  constructor(agent: Agent, position: GridVector) {
    this.agent = agent;
    this.position = position;
  }

  execute(): Command {
    app.agentCube.pushAgent(this.agent, this.position.row, this.position.column, this.position.layer);
    return new RemoveAgentFromWorld(this.agent);
  }
}
