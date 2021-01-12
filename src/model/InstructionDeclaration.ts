export type CommandInstance = any;

export type ParameterType = { new(...args: any[]): any };
export type Parameters = Record<string, ParameterType>;

export interface InstructionDeclaration {
  name: string;
  // class: ConstructableInstruction;
  icon: string;
  parameters: Parameters;
  explanation: (instruction: any) => string;
  code: (instruction: any) => string;
}
