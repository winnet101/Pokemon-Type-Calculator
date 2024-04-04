import { useState } from "react";
import StringInput from "../utils/StringInput";
import usePokeNames from "../utils/usePokeNames";

export default function PokeInput() {
  const [input, setInput] = useState("");
  const { pokemon, isLoading, hasError } = usePokeNames();

  const pokeNames = pokemon.map((api) => {
    return api.name;
  });

  async function getImage(name: string) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
  }

  return (
    <>
      <StringInput value={input} onChange={(ev) => setInput(ev)} />
      <ul>
        {input &&
          (isLoading
            ? "Loading..."
            : hasError
            ? "An error has occured fetching data."
            : pokeNames
                .filter((name) => name.indexOf(input) > -1 && name !== input)
                .slice(0, 10)
                .map((name, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setInput(name);
                    }}
                  >
                    {name}
                  </li>
                )))}
      </ul>
    </>
  );
}
