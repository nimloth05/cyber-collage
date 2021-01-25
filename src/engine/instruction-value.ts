export abstract class InstructionValue {
  get explanation() {
    return "explain your value as string";
  }

  static deserialize(jsString: string) {
    // return new this(JSON.parse(jsString));
    console.error("Temporarily disabled");
    return {};
  }

  serialize(): string {
    console.error("Temporarily disabled");
    return "";
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
}

export class ShapeNameValue extends InstructionValue {
  shapeId: string;

  constructor(shapeId: string) {
    super();
    this.shapeId = shapeId;
  }
}

export class FormulaValue extends InstructionValue {
  formula: string;

  constructor(formula: string) {
    super();
    this.formula = formula;
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
