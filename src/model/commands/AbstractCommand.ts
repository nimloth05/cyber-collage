import {Command} from "@/model/Command";
import {WORLD_CONTEXT_ID} from "@/model/Commands";

export abstract class AbstractCommand implements Command {
  contextId = WORLD_CONTEXT_ID;
  timeStamp: number = new Date().valueOf();

  abstract equals(command: Command): boolean;

  abstract execute(): Command;
}
