export class GridVector {
  // eslint-disable-next-line
  constructor(public readonly column: number,
              public readonly row: number,
              public readonly layer: number = 0) {
  }

  equals(obj: object): boolean {
    if (!(obj instanceof GridVector)) return false;
    return this.layer === obj.layer && this.row === obj.row && this.column === obj.column;
  }

  add(deltaRow: number, deltaColumn: number, deltaLayer: number): GridVector {
    return new GridVector(this.column + deltaColumn, this.row + deltaRow, this.layer + deltaLayer);
  }

  toString(): string {
    return `[${this.column}, ${this.row}, ${this.layer}]`;
  }
}
