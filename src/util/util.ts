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
