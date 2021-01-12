export type UndoContextId = string;

export interface Command {
  execute(): Command;

  contextId: UndoContextId;
  /**
   * Time, when this command was created. (time in millis, as returned from Date.valueOf())
   */
  timeStamp: number;

  equals(command: Command): boolean;
}
