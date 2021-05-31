import {Instruction} from "@/engine/Instruction";
import {
  AgentClassValue,
  AxisValue,
  DirectionValue,
  FormulaValue,
  InstructionValue,
  OperatorValue,
  ShapeNameValue,
  SoundValue,
} from "@/engine/instruction-value";
import {InstructionDeclaration, ParameterType} from "@/model/InstructionDeclaration";
import {app} from "@/engine/app";

// ***************************************************
// I N S T R U C T I O N   D E F I N I T I O N S
// ***************************************************

// Why don't you use class literals directly? Because JS cannot load the code with cyclic deps. properly.
// If we use Condition instead of "Condition" the class literal would be empty if the Condition class would backref to this class.
export const ACTION_TYPE = "Action";
export const CONDITION_TYPE = "Condition";

export function getDefaultValue(name: string, type: ParameterType): InstructionValue {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  if (type.getDefaultValue != null) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return type.getDefaultValue();
  }

  if (type.name === ShapeNameValue.name) {
    return new ShapeNameValue("cat");
  }
  if (type.name === AgentClassValue.name) {
    return new AgentClassValue(app.repository.agentClasses.length !== 0 ? app.repository.agentClasses[0].name : "");
  }
  if (type.name === FormulaValue.name) {
    return new FormulaValue("");
  }
  if (type.name === AxisValue.name) {
    return new AxisValue("beta");
  }
  if (type.name === OperatorValue.name) {
    return new OperatorValue(">");
  }
  return new DirectionValue(0, 1);
}

export const instructionDefinitions: Array<InstructionDeclaration> = [
  // Conditions
  {
    name: "see",
    instructionType: CONDITION_TYPE,
    parameters: {
      direction: DirectionValue,
      agentClassName: AgentClassValue,
    },
    code(instruction: Instruction) {
      const agentClassName = instruction.getArgumentValue<AgentClassValue>("agentClassName")!;
      const direction = instruction.getArgumentValue<DirectionValue>("direction")!;
      return `this.seeAgent('${agentClassName.agentClassName}', ${direction.row}, ${direction.column})`;
    },
    icon: "img/instructions/conditions/open-eye.svg",
    explanation({shape, direction}: any) {
      return `True if I see to ${direction.explain} an ${shape.explain}.`;
    },
    defaultArguments: getDefaultValue,
  },
  // {
  //   name: "percentChance",
  //   instructionType: CONDITION_TYPE,
  //   parameters: {
  //     chance: FormulaValue,
  //   },
  //   code(instruction: Instruction) {
  //     return `this.percentChance(${instruction.getArgumentValue<FormulaValue>("chance")?.formula})`;
  //   },
  //   icon: "percentChance.png",
  //   // explanation: () => `True with a ${chance.explain} percent chance.`,
  //   // FIXME: Replace with above code, after its clear what "chance" is
  //   explanation: () => "True with a <unknown> percent chance.",
  //   defaultArguments: getDefaultValue,
  // },
  {
    name: "empty",
    instructionType: CONDITION_TYPE,
    parameters: {
      direction: DirectionValue,
    },
    code(instruction: Instruction) {
      const direction = instruction.getArgumentValue<DirectionValue>("direction")!;
      return `this.empty(${direction.row}, ${direction?.column})`;
    },
    icon: "img/instructions/conditions/empty.svg",
    explanation: () => "Prüfe ob in angegebener Richtung kein Agent steht",
    defaultArguments: getDefaultValue,
  },
  {
    name: "tab",
    instructionType: CONDITION_TYPE,
    parameters: {},
    code(instruction: Instruction) {
      return "this.getTappedStateAndReset()";
    },
    icon: "img/instructions/conditions/hand-pointer.svg",
    explanation: () => "",
    defaultArguments: getDefaultValue,
  },
  {
    name: "tilted",
    instructionType: CONDITION_TYPE,
    parameters: {
      axis: AxisValue,
      comparisonOperator: OperatorValue,
      value: FormulaValue,
    },
    code(instruction: Instruction) {
      const axisValue: AxisValue = instruction.getArgumentValue("axis") ?? new AxisValue("beta");
      const operatorValue: OperatorValue = instruction.getArgumentValue("comparisonOperator") ?? new OperatorValue("<");
      const value: FormulaValue = instruction.getArgumentValue("value") ?? new FormulaValue("0");
      const validFormula = value.formula !== "" ? value.formula : "0";
      return `this.deviceOrientationCondition('${axisValue.value}', '${operatorValue.value}', '${validFormula}')`;
    },
    icon: "img/instructions/conditions/kippen.svg",
    explanation: () => "",
    defaultArguments: getDefaultValue,
  },
  // Actions
  {
    name: "move",
    instructionType: ACTION_TYPE,
    parameters: {
      direction: DirectionValue,
    },
    code(instruction: Instruction) {
      console.log("here");
      const {direction} = instruction.args;
      const asDirectionValue = direction as DirectionValue;
      return `this.move(${asDirectionValue.row}, ${asDirectionValue.column})`;
    },
    icon: "img/instructions/actions/move.svg",
    explanation({direction}: any) {
      return `I move to the ${direction.explain}`;
    },
    defaultArguments: getDefaultValue,
  },
  {
    name: "moveRandom",
    instructionType: ACTION_TYPE,
    parameters: {},
    code(instruction: Instruction) {
      return "this.moveRandom()";
    },
    icon: "img/instructions/actions/moverandom.svg",
    explanation({direction}: any) {
    return "I move random}";
    },
    defaultArguments: getDefaultValue,
  },

  {
    name: "createNew",
    instructionType: ACTION_TYPE,
    parameters: {
      direction: DirectionValue,
      agent: AgentClassValue,
    },
    code(instruction: Instruction) {
      const direction = instruction.getArgumentValue<DirectionValue>("direction")!;
      const agentName = instruction.getArgumentValue<AgentClassValue>("agent")!;
      return `this.createNew('${agentName.agentClassName}', ${direction.row}, ${direction.column})`;
    },
    icon: "img/instructions/actions/new.svg",
    explanation({direction}: any) {
      return `I create a new Agent in ${direction.explain}`;
    },
    defaultArguments: getDefaultValue,
  },
  {
    name: "playSound",
    instructionType: ACTION_TYPE,
    parameters: {
      sound: SoundValue,
    },
    code(instruction: Instruction) {
      const sound = instruction.getArgumentValue<SoundValue>("sound");
      // return `this.playSound('${sound.value}')`;
      return `this.playSound('${sound?.fileName ?? ""}', '${sound?.pitchFormula ?? ""}')`;
    },
    icon: "img/instructions/actions/play-sound.svg",
    explanation({direction}: any) {
      return `I move to the ${direction.explain}`;
    },
    defaultArguments: getDefaultValue,
  },
  // {
  //   name: "rule",
  //   class: Rule,
  //   parameters: {
  //     conditions: AndConditionList,
  //     actions: ActionList,
  //   },
  //   code(instruction) {
  //     const {conditions, actions} = instruction.parameterObjects;
  //     return `if (${conditions.expand()}) \r\n    {${actions.expand()}}\r\n`;
  //   },
  //   icon: "rule.png",
  //   explanation({conditions, actions}) {
  //     return "if all the conditions are true then I run my actions";
  //   },
  // },
  // {
  //   name: "method",
  //   class: Action,
  //   parameters: {
  //     name: MethodNameValue,
  //     rules: RuleList,
  //   },
  //   code(instruction) {
  //     const {name, rules} = instruction.parameterObjects;
  //     return `\r\n${name.value}() {\r\n${rules.expand()}}`;
  //   },
  //   icon: "method.png",
  //   explanation(instruction) {
  //     return "I check my rules from top to bottom";
  //   },
  // },
  {
    name: "erase",
    instructionType: "Action",
    parameters: {
      direction: DirectionValue,
    },
    code(instruction: Instruction) {
      return "";
    },
    icon: "img/instructions/actions/delete.svg",
    explanation: () => "Ich lösche ein Agent",
    defaultArguments: getDefaultValue,
  },

  // {
  //   name: "repeat",
  //   class: Action,
  //   parameters: {
  //     times: FormulaValue,
  //     actions: ActionList,
  //   },
  //   code(instruction: Instruction) {
  //     const {times, actions} = instruction.parameterObjects;
  //     return `for (let i = 0; i < ${times.value}) {${actions.expand()}};`;
  //   },
  //   icon: "repeat.png",
  //   explanation: () => "I execute all actions first to last",
  // },
];

export const conditionDefinitions = instructionDefinitions.filter(it => it.instructionType === CONDITION_TYPE);

export const actionDefinitions = instructionDefinitions.filter(it => it.instructionType === ACTION_TYPE);

// FIXME: Use hashMap (lodash keyBy) here
export class InstructionDefinitions {
  static findDefinition(name: string): InstructionDeclaration | undefined {
    const definition = instructionDefinitions.find(definition => name === definition.name);
    if (!definition) console.trace(`cannot find definition ${name} `);
    return definition;
  }
}
