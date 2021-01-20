import {InstructionDeclaration} from "@/model/InstructionDeclaration";
import {Action, ActionList, Condition, Instruction} from "@/engine/Instruction";
import {DirectionValue, FormulaValue, ShapeNameValue, SoundValue} from "@/engine/instruction-value";

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
    code(instruction: any) {
      const {shape, direction} = instruction.parameterObjects;
      console.log("shape", shape);
      return `this.see('${shape.value}', ${direction.value[0]}, ${direction.value[1]})`;
    },
    icon: "see.png",
    explanation({shape, direction}: any) {
      return `True if I see to ${direction.explain} an ${shape.explain}.`;
    },
  },
  {
    name: "percentChance",
    class: Condition,
    parameters: {
      chance: FormulaValue,
    },
    code(instruction: Instruction) {
      return `this.percentChance(${instruction.parameterObjects.chance.value})`;
    },
    icon: "percentChance.png",
    // explanation: () => `True with a ${chance.explain} percent chance.`,
    // FIXME: Replace with above code, after its clear what "chance" is
    explanation: () => "True with a <unknown> percent chance.",
  },
  // Actions
  {
    name: "move",
    class: Action,
    parameters: {
      direction: DirectionValue,
    },
    code(instruction: Instruction) {
      const {direction} = instruction.parameterObjects;
      return `this.move(${direction.value[0]}, ${direction.value[1]})`;
    },
    icon: "icons/instructions/actions/move.svg",
    explanation({direction}: any) {
      return `I move to the ${direction.explain}`;
    },
  },
  {
    name: "playSound",
    class: Action,
    parameters: {
      sound: SoundValue,
    },
    code(instruction: Instruction) {
      const {sound} = instruction.parameterObjects;
      return `this.playSound('${sound.value}')`;
    },
    icon: "icons/instructions/actions/play-sound.svg",
    explanation({direction}: any) {
      return `I move to the ${direction.explain}`;
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
      // empty code
    },
    icon: "icons/instructions/actions/delete.svg",
    explanation: () => "Ich lösche ein Agent",
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
  static findDefinition(name: string) {
    const definition = instructionDefinitions.find(definition => name === definition.name);
    if (!definition) console.trace(`cannot find definition ${name} `);
    return definition;
  }
}
