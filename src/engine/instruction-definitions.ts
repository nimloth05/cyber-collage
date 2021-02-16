import {Instruction} from "@/engine/Instruction";
import {DirectionValue, FormulaValue, ShapeNameValue} from "@/engine/instruction-value";
import {InstructionDeclaration} from "@/model/InstructionDeclaration";

// ***************************************************
// I N S T R U C T I O N   D E F I N I T I O N S
// ***************************************************

// Why don't you use class literals directly? Because JS cannot load the code with cyclic deps. properly.
// If we use Condition instead of "Condition" the class literal would be empty if the Condition class would backref to this class.
export const ACTION_TYPE = "Action";
export const CONDITION_TYPE = "Condition";

export const instructionDefinitions: Array<InstructionDeclaration> = [
  // Conditions
  {
    name: "see",
    instructionType: CONDITION_TYPE,
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
  },

  {
    name: "percentChance",
    instructionType: CONDITION_TYPE,
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
  },
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
    icon: "img/instructions/conditions/question.svg",
    explanation: () => "Prüfe ob in angegebener Richtung kein Agent steht",
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
  },
  {
    name: "createNew",
    instructionType: ACTION_TYPE,
    parameters: {
      direction: DirectionValue,
        shape: ShapeNameValue,
    },
    code(instruction: Instruction) {
      const direction = instruction.getArgumentValue<DirectionValue>("direction")!;
      const shape = instruction.getArgumentValue<ShapeNameValue>("shape")!;
      return `this.createNew('${shape.shapeId}', ${direction.row}, ${direction.column})`;
    },
    icon: "img/instructions/actions/new.svg",
    explanation({direction}: any) {
      return `I create a new Agent in ${direction.explain}`;
    },
  },
  {
    name: "playSound",
    instructionType: ACTION_TYPE,
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
