export class GridVector {
  // eslint-disable-next-line
  constructor(public column: number,
              public row: number,
              public layer: number) {
  }

  equals(obj: object): boolean {
    if (!(obj instanceof GridVector)) return false;
    return this.layer === obj.layer && this.row === obj.row && this.column === obj.column;
  }
}
