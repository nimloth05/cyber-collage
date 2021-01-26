import {AbstractCommand} from "@/model/commands/AbstractCommand";
import {Command} from "@/model/Command";
import {ASTNode, ASTNodeList} from "@/engine/Instruction";
import {RemoveASTNodeCommand} from "@/model/commands/instruction/RemoveASTNodeCommand";

export class AddASTNodeCommand<T extends ASTNode> extends AbstractCommand {
  private readonly list: ASTNodeList<T>;
  private readonly node: T;

  constructor(list: ASTNodeList<T>, node: T) {
    super();
    this.list = list;
    this.node = node;
  }

  execute(): Command {
    this.list.add(this.node);
    return new RemoveASTNodeCommand(this.list, this.node);
  }

  equals(command: Command): boolean {
    return false;
  }
}
