import {AbstractCommand} from "@/model/commands/AbstractCommand";
import {Command} from "@/model/Command";
import {app} from "@/engine/app";
import {AgentMap} from "@/engine/Map";
import {UndoApplyMapChangesCommand} from "@/model/commands/UndoApplyMapChangesCommand";

export class ClearWorldCommand extends AbstractCommand {
  private map: AgentMap;

  constructor() {
    super();
    this.map = app.agentCube.map;
  }

  execute(): Command {
    const snapShot = this.map.createSnapShot();
    this.map.clearAll();
    return new UndoApplyMapChangesCommand(snapShot);
  }

  equals(command: Command): boolean {
    return false;
  }
}
