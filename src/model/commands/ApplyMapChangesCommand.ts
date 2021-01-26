import {UndoApplyMapChangesCommand} from "@/model/commands/UndoApplyMapChangesCommand";
import {AbstractCommand} from "@/model/commands/AbstractCommand";
import {Command} from "@/model/Command";
import {MapSnapShot} from "@/engine/Map";

export class ApplyMapChangesCommand extends AbstractCommand {
  private readonly snapShot: MapSnapShot;

  constructor(snapShot: MapSnapShot) {
    super();
    this.snapShot = snapShot;
  }

  execute(): Command {
    return new UndoApplyMapChangesCommand(this.snapShot);
  }

  equals(_: Command): boolean {
    return false;
  }
}
