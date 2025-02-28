function typedJson<T>(input: Response) {
  const res: Promise<T> = input.json();
  return res;
}

function toRemovedArray<T>(input: T, array: T[]): T[] {
  const index = array.indexOf(input);
  let newArray = array.slice();
  if (index > -1) {
    newArray.splice(index, 1);
  }
  return newArray;
}

export { typedJson, toRemovedArray };
