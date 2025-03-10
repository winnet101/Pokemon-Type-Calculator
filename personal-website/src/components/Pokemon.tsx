import { useState } from "react";
import styles from "../styles/Pokemon.module.css";
import TypeButton from "./TypeButton";
import usePokeTypes from "../utils/usePokeTypes";
import Searchbar from "./Searchbar";
import { PokeTypes, TYPE_LIST } from "../types";
import Results, { ResultsSkeleton } from "./Results";
import { Pokemon } from "../utils/poke-api-types/pokeApiTypes";
import { toRemovedArray } from "../utils/utils";

export default function Main() {
  const [searchbarText, setSearchbarText] = useState("");
  const [currTypes, setCurrTypes, pokeMatchups, isLoading] = usePokeTypes();
  const [currPokemon, setCurrPokemon] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  async function handleSetCurrPokemon(pokemon: string) {
    console.log(pokemon);
    setCurrPokemon(pokemon);

    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`
    );
    const pokemonData: Pokemon = await res.json();

    console.log(pokemonData);

    setCurrTypes(pokemonData.types.map((t) => t.type.name));
  }

  return (
    <>
      <Searchbar
        input={searchbarText}
        setInput={setSearchbarText}
        setCurrentPokemon={handleSetCurrPokemon}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
      />
      <div className={styles.buttonContainer}>
        {TYPE_LIST.map((type, i) => (
          <TypeButton
            key={i}
            el={type}
            handleClick={handleClick}
            className={`
            ${styles.button}
            ${currTypes.includes(type) && styles.selected}
          `}
          />
        ))}
      </div>

      <button
        className={styles.clearButton}
        onClick={() => {
          setSearchbarText("");
          setCurrTypes([]);
          setCurrPokemon("");
          setSearchResults([])
        }}
      >
        Clear types
      </button>

      {isLoading ? (
          <ResultsSkeleton />
      ) : (
        <Results currTypes={currTypes} pokeMatchups={pokeMatchups} />
      )}

    </>
  );

  function handleClick(type: PokeTypes) {
    if (!currTypes.includes(type) && currTypes.length < 2) {
      let newTypes = currTypes.slice();
      newTypes.push(type);
      setCurrTypes(newTypes);
    } else {
      if (currTypes.includes(type)) {
        const newInput = toRemovedArray(type, currTypes);
        setCurrTypes(newInput);
      }
    }
  }
}