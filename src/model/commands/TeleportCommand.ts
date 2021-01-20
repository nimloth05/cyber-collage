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
  }

  equals(command: Command): boolean {
    if (!(command instanceof TeleportCommand)) return false;
    return this.agent === command.agent && this.position.equals(command.position);
  }

  execute(): Command {
    const previousPosition = this.agent.getPosition();
    this.agent.teleportTo(this.position);
    return new TeleportCommand(this.agent, previousPosition);
  }
}
