export function typedJson<T>(input: Response) {
  const res: Promise<T> = input.json();
  return res;
}

export function useSubState<T extends Object>([state, setState]: [
  T,
  React.Dispatch<React.SetStateAction<T>>
]): {
  [Key in keyof T]:
  [T[Key], React.Dispatch<React.SetStateAction<T[Key]>>]
} {
  const entries = Object.entries(state);

  const convertedEntries = entries.map(([key, value]) => [
    key,
    [
      value,
      (updatedState: typeof value) => {
        setState((currentState) => {
          const newState = structuredClone(currentState);
          newState[key as keyof T] = updatedState;
          return newState;
        });
      },
    ],
  ]);

  return Object.fromEntries(convertedEntries);
}