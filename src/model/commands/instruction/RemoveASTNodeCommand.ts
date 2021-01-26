import {AbstractCommand} from "@/model/commands/AbstractCommand";
import {ASTNode, ASTNodeList} from "@/engine/Instruction";
import {Command} from "@/model/Command";
import {removeFromArray} from "@/util/util";
import {AddASTNodeCommand} from "@/model/commands/instruction/AddASTNodeCommand";

export class RemoveASTNodeCommand<T extends ASTNode> extends AbstractCommand {
  private readonly list: ASTNodeList<T>;
  private readonly node: T;

  constructor(list: ASTNodeList<T>, node: T) {
    super();
    this.list = list;
    this.node = node;
  }

  execute(): Command {
    removeFromArray(this.list.instructionObjects, this.node);
    return new AddASTNodeCommand(this.list, this.node);
  }

  equals(command: Command): boolean {
    return false;
  }
}
