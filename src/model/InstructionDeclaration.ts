import {InstructionValue} from "@/engine/instruction-value";
import {ArgEntry} from "@/engine/tool/SaveModel";

export type CommandInstance = any;

export type ParameterType = { new(...args: any[]): any };
export type Parameters = Record<string, ParameterType>;
export type Arguments = Record<string, InstructionValue>;

export interface InstructionDeclaration {
  name: string;
  class: any;
  icon: string;
  parameters: Parameters;
  explanation: (instruction: any) => string;
  code: (instruction: any) => string;
  deserialize: (argEntries: Record<string, ArgEntry>) => Arguments;
}
