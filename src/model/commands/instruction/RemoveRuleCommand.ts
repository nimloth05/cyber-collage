import {Command} from "@/model/Command";
import {Method, Rule} from "@/engine/Instruction";
import {AbstractCommand} from "@/model/commands/AbstractCommand";
import {removeFromArray} from "@/util/util";
import {AddRuleCommand} from "@/model/commands/instruction/AddRuleCommand";

export class RemoveRuleCommand extends AbstractCommand {
  private readonly method: Method;
  private readonly rule: Rule;

  constructor(method: Method, rule: Rule) {
    super();
    this.method = method;
    this.rule = rule;
  }

  execute(): Command {
    removeFromArray(this.method.rules.instructions, this.rule);
    return new AddRuleCommand(this.method, this.rule);
  }

  equals(command: Command): boolean {
    if (!(command instanceof RemoveRuleCommand)) return false;
    return this.method.name === command.method.name;
  }
}
