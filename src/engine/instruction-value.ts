export class InstructionValue {
  private _value!: any;

  constructor(value: any) {
    if (value) this.value = value;
    this.test = value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.test = value;
  }

  get test() {
    return this._value;
  }

  set test(value) {
    this._value = value;
  }

  get explanation() {
    return "explain your value as string";
  }

  static deserialize(jsString: string) {
    return new this(JSON.parse(jsString));
  }

  serialize() {
    return JSON.stringify(this.value);
  }
}

export class DirectionValue extends InstructionValue {

}

export class ShapeNameValue extends InstructionValue {

}

export class FormulaValue extends InstructionValue {

}

export class MethodNameValue extends InstructionValue {

}

export class SoundValue extends InstructionValue {

}

class MethodNameEditor extends InstructionValue {

}
