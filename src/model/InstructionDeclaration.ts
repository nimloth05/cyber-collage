import {InstructionValue} from "@/engine/instruction-value";
import {ArgEntry} from "@/engine/tool/SaveModel";

export type CommandInstance = any;

export type ParameterType = { new(...args: any[]): any; deserialize: (value: ArgEntry) => any };
export type Parameters = Record<string, ParameterType>;
export type Arguments = Record<string, InstructionValue>;

export interface InstructionDeclaration {
  name: string;
  instructionType: string;
  icon: string;
  parameters: Parameters;
  explanation: (instruction: any) => string;
  code: (instruction: any) => string;
}
