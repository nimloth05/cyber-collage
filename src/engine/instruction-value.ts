import {ArgEntry} from "@/engine/tool/SaveModel";

export abstract class InstructionValue {
  get explanation() {
    return "explain your value as string";
  }
}

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

//
// export class MethodNameValue extends InstructionValue {
//
// }
//
// export class SoundValue extends InstructionValue {
//
// }
