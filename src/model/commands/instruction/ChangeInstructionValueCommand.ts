import {AbstractCommand} from "@/model/commands/AbstractCommand";
import {Instruction} from "@/engine/Instruction";
import {Command} from "@/model/Command";
import {InstructionValue} from "@/engine/instruction-value";

export class ChangeInstructionValueCommand extends AbstractCommand {
  private readonly instruction: Instruction;
  private readonly name: string;
  private readonly value: InstructionValue;

  constructor(instruction: Instruction, name: string, value: InstructionValue) {
    super();
    this.instruction = instruction;
    this.name = name;
    this.value = value;
  }

  execute(): Command {
    const oldValue = this.instruction.getArgumentValue(this.name)!;
    this.instruction.setArgumentValue(this.name, this.value);
    return new ChangeInstructionValueCommand(this.instruction, this.name, oldValue);
  }

  equals(command: Command): boolean {
    return false;
  }
}
