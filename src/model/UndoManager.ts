import {Command, UndoContextId} from "@/model/Command";
import {ListenerList} from "@/model/util/ListenerList";
import {Disposable} from "@/model/util/Disposable";
import {CompositeCommand} from "@/model/commands/CompositeCommand";

export type UndoListener = () => void

const MERGE_THRESHOLD = 150; // in millis

export class UndoManager {
  private undoStack: Record<UndoContextId, Array<Command>> = {};
  private redoStack: Record<UndoContextId, Array<Command>> = {};
  private listeners: ListenerList<UndoListener> = new ListenerList();

  execute(command: Command): void {
    const stack = UndoManager.getStack(command.contextId, this.undoStack);

    const undoCommand = command.execute();
    if (stack.length > 0) {
      // check for merging process
      const lastCommand = stack[stack.length - 1];
      if ((command.timeStamp - lastCommand.timeStamp) < MERGE_THRESHOLD) {
        stack.pop();
        // FIXME: Improve this (Check if previous command is composite command)
        stack.push(new CompositeCommand(lastCommand.contextId, [lastCommand, undoCommand]));
      } else {
        stack.push(undoCommand);
      }
    } else {
      stack.push(undoCommand);
    }
    const redoContextStack = UndoManager.getStack(command.contextId, this.redoStack);
    redoContextStack.splice(0, redoContextStack.length);
    this.listeners.notify();
  }

  undo(contextId: UndoContextId): void {
    const command = UndoManager.getStack(contextId, this.undoStack).pop();
    console.log("execute undo command", command);
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
