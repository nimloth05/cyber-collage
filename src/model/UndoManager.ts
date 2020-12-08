import {Command, UndoContextId} from "@/model/Command";
import {ListenerList} from "@/model/util/ListenerList";

export type UndoListener = () => void

export class UndoManager {
  private undoStack: Record<UndoContextId, Array<Command>> = {};
  private redoStack: Record<UndoContextId, Array<Command>> = {};
  private listeners: ListenerList<UndoListener> = new ListenerList();

  execute(command: Command): void {
    this.getStack(command.contextId, this.undoStack).push(command.execute());
    const redoContextStack = this.getStack(command.contextId, this.redoStack);
    redoContextStack.splice(0, redoContextStack.length);
    this.listeners.notify();
  }

  undo(contextId: UndoContextId): void {
    const command = this.getStack(contextId, this.undoStack).pop();
    if (command !== undefined) {
      this.getStack(contextId, this.redoStack).push(command.execute());
      this.listeners.notify();
    }
  }

  redo(contextId: UndoContextId): void {
    const command = this.getStack(contextId, this.redoStack).pop();
    if (command !== undefined) {
      this.getStack(contextId, this.undoStack).push(command.execute());
      this.listeners.notify();
    }
  }

  private getStack(contextId: UndoContextId, stackRef: Record<UndoContextId, Array<Command>>): Array<Command> {
    let result = stackRef[contextId];
    if (result == null) {
      result = [];
      stackRef[contextId] = [];
    }
    return result;
  }

  canUndo(contextId: UndoContextId): boolean {
    return this.undoStack[contextId].length > 0;
  }

  canRedo(contextId: UndoContextId): boolean {
    return this.redoStack[contextId].length > 0;
  }
}
