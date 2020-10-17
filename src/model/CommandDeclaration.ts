export type CommandInstance = any;

export enum CommandType {
  CONDITION,
  ACTION
}

export type ParameterType = {

}

export type ParameterConfiguration = {
  type: ParameterType,
}

export type CommandDeclaration = {
  name: string,
  type: CommandType,
  icon: string,
  parameters: Record<string, ParameterConfiguration>
  explanation: string,
  compile: () => string
};
