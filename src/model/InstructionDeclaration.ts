import {InstructionValue} from "@/engine/instruction-value";
import {Instruction} from "@/engine/Instruction";

export type CommandInstance = any;

export enum CommandType {
  CONDITION,
  ACTION
}

export type ConstructableInstruction = { new(name: string, parameters: Record<string, any>): Instruction };
export type ParameterType = { new(...args: any[]): any };
export type Parameters = Record<string, ParameterType>;

export type InstructionDeclaration = {
  name: string;
  class: ConstructableInstruction;
  icon: string;
  parameters: Parameters;
  explanation: (instruction: any) => string;
  code: (instruction: any) => string;
};
