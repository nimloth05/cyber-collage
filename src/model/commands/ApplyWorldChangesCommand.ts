import {app} from "@/engine/app";
import {UndoWorldApplyCommand} from "@/model/commands/UndoWorldApplyCommand";
import {AbstractCommand} from "@/model/commands/AbstractCommand";
import {Command} from "@/model/Command";

export class ApplyWorldChangesCommand extends AbstractCommand {
  execute(): Command {
    const snapShot = app.agentCube.map.createSnapShot();
    return new UndoWorldApplyCommand(snapShot);
  }

  equals(_: Command): boolean {
    return false;
  }
}
