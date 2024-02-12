import { NamedAPIResource } from "../types.tsx";

export function typedJson<T>(input: Response) {
  const res: Promise<T> = input.json();
  return res;
}

export function apiResourceToArray(api: NamedAPIResource[]) {
  const arr: string[] = [];
  for (const [_key, value] of Object.entries(api)) {
    arr.push(value.name);
  }
  return(arr);
}
