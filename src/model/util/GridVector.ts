export class GridVector {
  // eslint-disable-next-line
  constructor(public column: number,
              public row: number,
              public layer: number = 0) {
  }

  equals(obj: object): boolean {
    if (!(obj instanceof GridVector)) return false;
    return this.layer === obj.layer && this.row === obj.row && this.column === obj.column;
  }

  toString(): string {
    return `[${this.column}, ${this.row}, ${this.layer}]`;
  }
}
