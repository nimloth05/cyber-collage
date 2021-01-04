import {InstructionDefinitions} from "@/engine/instruction-definitions";
import {Instruction} from "@/engine/Instruction";

export function createInstruction(name: string, parameters: any): Instruction {
  // console.log("createInstruction name: ", name, "parameters: ", parameters);
  const definition = InstructionDefinitions.findDefinition(name);
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line
  return new definition.class(definition, parameters);
}

export function deserializeInstruction(jsString: string): Instruction {
  // a serialization string is an array [<nameString>, <parameterProperties>]
  const [name, parameters] = JSON.parse(jsString);
  return createInstruction(name, parameters);
}
