export type UndoContextId = string;

export interface Command {
  execute(): Command;
  contextId: UndoContextId;
}
