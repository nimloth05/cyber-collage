/* eslint-disable */
import {CompositeCommand} from "@/model/commands/CompositeCommand";
import {Command} from "@/model/Command";
import {removeFromArray} from "@/util/util";
import {expect} from "chai";

class ListCommand implements Command {
  contextId = "1";
  timeStamp = new Date().valueOf();
  list: Array<string>;
  item: string;

  constructor(list: Array<string>, item: string) {
    this.list = list;
    this.item = item;
  }

  equals(command: Command): boolean {
    return true;
  }

  execute(): Command {
    this.list.push(this.item);
    return new RemoveCommand(this.list, this.item);
  }

  toString(): string {
    return `ListCommand ${this.item}`;
  }
}

class RemoveCommand implements Command {
  contextId = "1";
  timeStamp = new Date().valueOf();
  list: Array<string>;
  item: string;

  constructor(list: Array<string>, item: string) {
    this.list = list;
    this.item = item;
  }

  equals(command: Command): boolean {
    return true;
  }

  execute(): Command {
    removeFromArray(this.list, this.item);
    return new ListCommand(this.list, this.item);
  }

  toString(): string {
    return `RemoveCommand ${this.item}`;
  }
}

describe("CompositeCommand", () => {
  it("command tests", () => {
    const list: Array<string> = [];

    const command = new ListCommand(list, "A");
    const undo = command.execute();
    expect(list).to.include("A");
    const redo = undo.execute();
    expect(list.length).to.be.eq(0);
    redo.execute();
    expect(list).to.include("A");
  });

  it("handles undo redo correctly", () => {
    const list: Array<string> = ["A", "B"];

    const compositeCommand = new CompositeCommand("1", [
      new RemoveCommand(list, "A"),
      new RemoveCommand(list, "B"),
    ]);

    const undo = compositeCommand.execute();
    expect(list.length).to.be.eq(0);

    undo.execute();

    expect(list[0]).to.eq("A");
    expect(list[1]).to.eq("B");
  });
});
