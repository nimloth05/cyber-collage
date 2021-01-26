import {AbstractCommand} from "@/model/commands/AbstractCommand";
import {Command} from "@/model/Command";
import {Method, Rule} from "@/engine/Instruction";
import {RemoveRuleCommand} from "@/model/commands/instruction/RemoveRuleCommand";

export class AddRuleCommand extends AbstractCommand {
  private readonly method: Method;
  private readonly rule: Rule;

  constructor(method: Method, rule: Rule = new Rule()) {
    super();
    this.method = method;
    this.rule = rule;
  }

  execute(): Command {
    this.method.rules.add(this.rule);
    return new RemoveRuleCommand(this.method, this.rule);
  }

  equals(command: Command): boolean {
    if (!(command instanceof AddRuleCommand)) return false;
    return command.method.name === this.method.name;
  }
}
