/**
 *
 * @param array
 * @param element
 * @return index of removed element
 */
export function removeFromArray(array: Array<any>, element: unknown): number {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
  return index;
}

export function mapValue(x: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
