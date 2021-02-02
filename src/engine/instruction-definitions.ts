import {Action, Condition, Instruction} from "@/engine/Instruction";
import {DirectionValue, FormulaValue, ShapeNameValue} from "@/engine/instruction-value";
import {Arguments, InstructionDeclaration} from "@/model/InstructionDeclaration";
import {ArgEntry} from "@/engine/tool/SaveModel";

// ***************************************************
// I N S T R U C T I O N   D E F I N I T I O N S
// ***************************************************

export const instructionDefinitions: Array<any> = [
  // Conditions
  {
    name: "see",
    class: Condition,
    parameters: {
      direction: DirectionValue,
      shape: ShapeNameValue,
    },
    code(instruction: Instruction) {
      const shape = instruction.getArgumentValue<ShapeNameValue>("shape")!;
      const direction = instruction.getArgumentValue<DirectionValue>("direction")!;
      return `this.see('${shape.shapeId}', ${direction.row}, ${direction.column})`;
    },
    icon: "img/instructions/conditions/open-eye.svg",
    explanation({shape, direction}: any) {
      return `True if I see to ${direction.explain} an ${shape.explain}.`;
    },
    deserialize(argEntries: Record<string, ArgEntry>): Arguments {
      const result: Record<string, any> = {};

      const directionValues = argEntries.direction;
      result.direction = new DirectionValue(directionValues.row, directionValues.column);

      const shapeValues = argEntries.shape;
      result.shape = new ShapeNameValue(shapeValues.shapeId);
      return result;
    },
  },
  {
    name: "percentChance",
    class: Condition,
    parameters: {
      chance: FormulaValue,
    },
    code(instruction: Instruction) {
      return `this.percentChance(${instruction.getArgumentValue<FormulaValue>("chance")?.formula})`;
    },
    icon: "percentChance.png",
    // explanation: () => `True with a ${chance.explain} percent chance.`,
    // FIXME: Replace with above code, after its clear what "chance" is
    explanation: () => "True with a <unknown> percent chance.",
    deserialize(argEntries: Record<string, ArgEntry>): Arguments {
      const result: Record<string, any> = {};
      const chanceValue = argEntries.chance;
      result.chance = new FormulaValue(chanceValue.formula);
      return result;
    },
  },
  // Actions
  {
    name: "move",
    class: Action,
    parameters: {
      direction: DirectionValue,
    },
    code(instruction: Instruction) {
      const {direction} = instruction.args;
      const asDirectionValue = direction as DirectionValue;
      return `this.move(${asDirectionValue.row}, ${asDirectionValue.column})`;
    },
    icon: "img/instructions/actions/move.svg",
    explanation({direction}: any) {
      return `I move to the ${direction.explain}`;
    },
    deserialize(argEntries: Record<string, ArgEntry>): Arguments {
      const result: Record<string, any> = {};
      const directionValues = argEntries.direction;
      result.direction = new DirectionValue(directionValues.row, directionValues.column);
      return result;
    },
  },
  {
    name: "playSound",
    class: Action,
    parameters: {
      // sound: SoundValue,
      // FIXME: Replace with SoundValue
      sound: FormulaValue,
    },
    code(instruction: Instruction) {
      // const {sound} = instruction.args;
      // return `this.playSound('${sound.value}')`;
      return "";
    },
    icon: "img/instructions/actions/play-sound.svg",
    explanation({direction}: any) {
      return `I move to the ${direction.explain}`;
    },
    deserialize(argEntries: Record<string, ArgEntry>): Arguments {
      const result: Record<string, any> = {};
      const soundValue = argEntries.direction;
      result.sound = new FormulaValue(soundValue.sound);
      return result;
    },
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
  // {
  //   name: "behavior",
  //   class: Behavior,
  //   parameters: {
  //     methods: MethodList,
  //   },
  //   code(instruction) {
  //     const {methods} = instruction.parameterObjects;
  //     return `${methods.expand()}`;
  //   },
  //   icon: "behavior.png",
  //   explanation(instruction) {
  //     return "I have a number of methods";
  //   },
  // },
  {
    name: "erase",
    class: Action,
    parameters: {
      direction: DirectionValue,
    },
    code(instruction: Instruction) {
      return "";
    },
    icon: "img/instructions/actions/delete.svg",
    explanation: () => "Ich lösche ein Agent",
    deserialize(argEntries: Record<string, ArgEntry>): Arguments {
      const result: Record<string, any> = {};
      const directionValues = argEntries.direction;
      result.direction = new DirectionValue(directionValues.row, directionValues.column);
      return result;
    },
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

// FIXME: Use hashMap (lodash keyBy) here
export class InstructionDefinitions {
  static findDefinition(name: string): InstructionDeclaration | undefined {
    const definition = instructionDefinitions.find(definition => name === definition.name);
    if (!definition) console.trace(`cannot find definition ${name} `);
    return definition;
  }
}
