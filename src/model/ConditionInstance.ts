export class ConditionInstance {
  name: string;

  get key() {
    return this.name;
  }

  constructor(name: string) {
    this.name = name;
  }
}
