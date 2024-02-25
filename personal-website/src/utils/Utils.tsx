export function typedJson<T>(input: Response) {
  const res: Promise<T> = input.json();
  return res;
} 