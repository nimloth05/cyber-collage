import {Command} from "@/model/Command";
import {WORLD_CONTEXT_ID} from "@/model/Commands";
import {Agent} from "@/engine/Agent";
import {GridVector} from "@/model/util/GridVector";

export class TeleportCommand implements Command {
  contextId = WORLD_CONTEXT_ID;
  timeStamp: number = new Date().valueOf();

  agent: Agent;
  position: GridVector;

  constructor(agent: Agent, position: GridVector) {
    this.agent = agent;
    this.position = position;
    console.log(`creating TeleportCommand: ${this.position}`);
  }

  execute(): Command {
    const previousPosition = this.agent.gridPosition;
    this.agent.teleportTo(this.position);
    console.log(`teleporting agent from ${previousPosition} to new ${this.position} (agent.getPosition: ${this.agent.gridPosition})`);
    return new TeleportCommand(this.agent, previousPosition);
  }

  equals(command: Command): boolean {
    if (!(command instanceof TeleportCommand)) return false;
    return this.agent === command.agent && this.position.equals(command.position);
  }
}
