import {Command, UndoContextId} from "@/model/Command";

export class CompositeCommand implements Command {
  contextId: UndoContextId;
  timeStamp: number;

  private commands: Array<Command> = [];

  constructor(contextId: UndoContextId, commands: Array<Command>) {
    this.contextId = contextId;
    this.timeStamp = new Date().valueOf();
    this.commands = commands;
  }

  equals(command: Command): boolean {
    if (!(command instanceof CompositeCommand)) return false;
    if (command.commands.length !== this.commands.length) return false;
    for (let i = 0; i < this.commands.length; ++i) {
      if (!this.commands[i].equals(command.commands[i])) return false;
    }
    return true;
  }

  execute(): Command {
    const reverseCommands = this.commands.map(c => c.execute());
    return new CompositeCommand(this.contextId, reverseCommands);
  }
}
