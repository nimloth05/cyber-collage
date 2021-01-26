import {AbstractCommand} from "@/model/commands/AbstractCommand";
import {Command} from "@/model/Command";
import {MapSnapShot} from "@/engine/Map";
import {app} from "@/engine/app";

export class UndoApplyMapChangesCommand extends AbstractCommand {
  private readonly snapShot: MapSnapShot;

  constructor(snapShot: MapSnapShot) {
    super();
    this.snapShot = snapShot;
  }

  execute(): Command {
    const snapShot = app.agentCube.map.createSnapShot();
    app.agentCube.map.applySnapShot(this.snapShot);
    return new UndoApplyMapChangesCommand(snapShot);
  }

  equals(command: Command): boolean {
    return false;
  }
}
