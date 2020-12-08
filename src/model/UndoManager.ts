import {Command, UndoContextId} from "@/model/Command";
import {ListenerList} from "@/model/util/ListenerList";
import {Disposable} from "@/model/util/Disposable";

export type UndoListener = () => void

export class UndoManager {
  private undoStack: Record<UndoContextId, Array<Command>> = {};
  private redoStack: Record<UndoContextId, Array<Command>> = {};
  private listeners: ListenerList<UndoListener> = new ListenerList();

  execute(command: Command): void {
    UndoManager.getStack(command.contextId, this.undoStack).push(command.execute());
    const redoContextStack = UndoManager.getStack(command.contextId, this.redoStack);
    redoContextStack.splice(0, redoContextStack.length);
    this.listeners.notify();
  }

  undo(contextId: UndoContextId): void {
    const command = UndoManager.getStack(contextId, this.undoStack).pop();
    if (command != null) {
      UndoManager.getStack(contextId, this.redoStack).push(command.execute());
      this.listeners.notify();
    }
  }

  redo(contextId: UndoContextId): void {
    const command = UndoManager.getStack(contextId, this.redoStack).pop();
    if (command != null) {
      UndoManager.getStack(contextId, this.undoStack).push(command.execute());
      this.listeners.notify();
    }
  }

  canUndo(contextId: UndoContextId): boolean {
    return this.undoStack[contextId].length > 0;
  }

  canRedo(contextId: UndoContextId): boolean {
    return this.redoStack[contextId].length > 0;
  }

  addListener(undoListener: UndoListener): Disposable {
    return this.listeners.register(undoListener);
  }

  private static getStack(contextId: UndoContextId, stackRef: Record<UndoContextId, Array<Command>>): Array<Command> {
    let result = stackRef[contextId];
    if (result == null) {
      result = [];
      stackRef[contextId] = [];
    }
    return result;
  }
}
