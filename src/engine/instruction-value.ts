import {ArgEntry} from "@/engine/tool/SaveModel";

export abstract class InstructionValue {
  get explanation() {
    return "explain your value as string";
  }
}

// interface IconConfiguration {
//   iconPath: string[];
//   gridSize: [number, number];
// }
//
// interface IconEditor {
//   handleIconClicked(icon: string): void;
//
//   iconConfiguration: IconConfiguration;
// }
//
// export class CustomValue extends InstructionValue implements IconEditor {
//   get iconConfiguration(): IconConfiguration {
//     return {
//       iconPath: ["A.svg", "B.svg", "C.svg", "D.svg"],
//       gridSize: [2, 2],
//     };
//   }
//
//   handleIconClicked(icon: string): void {
//     if (icon === "A.svg") {
//       this.doAThing();
//     } else if (icon === "B.svg") {
//       this.doBThing();
//     }
//   }
// }

export class DirectionValue extends InstructionValue {
  row: number;
  column: number;

  constructor(row: number, column: number) {
    super();
    this.row = row;
    this.column = column;
  }

  static deserialize(argValue: ArgEntry): DirectionValue {
    return new DirectionValue(argValue.row, argValue.column);
  }
}

export class ShapeNameValue extends InstructionValue {
  shapeId: string;

  constructor(shapeId: string) {
    super();
    this.shapeId = shapeId;
  }

  static deserialize(argValue: ArgEntry): ShapeNameValue {
    console.log("argValue", argValue);
    return new ShapeNameValue(argValue.shapeId);
  }
}

export class AgentClassValue extends InstructionValue {
  agentClassName: string;

  constructor(name: string) {
    super();
    this.agentClassName = name;
  }

  static deserialize(argValue: ArgEntry): AgentClassValue {
    return new AgentClassValue(argValue.agentClassName);
  }
}

export class FormulaValue extends InstructionValue {
  formula: string;

  constructor(formula: string) {
    super();
    this.formula = formula;
  }

  static deserialize(argValue: ArgEntry): FormulaValue {
    return new FormulaValue(argValue.formula);
  }
}

export class SoundValue extends InstructionValue {
  fileName: string;
  pitchFormula: string;

  constructor(fileName: string, pitchFormula: string) {
    super();
    this.fileName = fileName;
    this.pitchFormula = pitchFormula;
  }

  static deserialize(argValue: ArgEntry): SoundValue {
    return new SoundValue(argValue.fileName!, argValue.pitchFormula!);
  }

  static getDefaultValue(): SoundValue {
    return new SoundValue("?", "");
  }
}

//
// export class MethodNameValue extends InstructionValue {
//
// }
//
// export class SoundValue extends InstructionValue {
//
// }
