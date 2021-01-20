import {Command, UndoContextId} from "@/model/Command";

export class CompositeCommand implements Command {
  contextId: UndoContextId;
  timeStamp: number;

  private readonly commands: Array<Command> = [];

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
    const list: Array<Command> = [];
    for (let i = this.commands.length - 1; i > -1; --i) {
      list.push(this.commands[i].execute());
    }
    return new CompositeCommand(this.contextId, list);
  }

  pushCommand(command: Command): void {
    this.commands.push(command);
  }
}
