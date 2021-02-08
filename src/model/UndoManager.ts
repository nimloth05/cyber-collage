import {Command, UndoContextId} from "@/model/Command";
import {ListenerList} from "@/model/util/ListenerList";
import {Disposable} from "@/model/util/Disposable";
import {CompositeCommand} from "@/model/commands/CompositeCommand";

export type UndoListener = () => void

/**
 * Coalesce threshold for commands. If commands are executed in this threshold they are merge together.
 */
const MERGE_THRESHOLD = 150; // in millis

export class UndoManager {
  private undoStack: Record<UndoContextId, Array<Command>> = {};
  private redoStack: Record<UndoContextId, Array<Command>> = {};
  private listeners: ListenerList<UndoListener> = new ListenerList();

  execute(command: Command): void {
    const undoStack = UndoManager.getStack(command.contextId, this.undoStack);

    const undoCommand = command.execute();
    if (undoStack.length > 0) {
      // check for merging process
      const lastCommand = undoStack[undoStack.length - 1];
      if ((command.timeStamp - lastCommand.timeStamp) < MERGE_THRESHOLD) {
        if (lastCommand instanceof CompositeCommand) {
          lastCommand.pushCommand(undoCommand);
        } else {
          undoStack.pop();
          undoStack.push(new CompositeCommand(lastCommand.contextId, [lastCommand, undoCommand]));
        }
      } else {
        undoStack.push(undoCommand);
      }
    } else {
      undoStack.push(undoCommand);
    }
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
    const stack = this.undoStack[contextId];
    return stack != null && stack.length > 0;
  }

  canRedo(contextId: UndoContextId): boolean {
    const stack = this.redoStack[contextId];
    return stack != null && stack.length > 0;
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
