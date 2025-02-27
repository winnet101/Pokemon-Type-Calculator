import { useState } from "react";
import type { Pokemon } from "../pokeApiTypes";
import styles from "../styles/Pokemon.module.css";
import TypeButton from "./TypeButton";
import usePokeTypes from "../utils/usePokeTypes";
import PokeInput from "./PokeInput";
import { PokeTypes, pokeTypesList as TYPE_LIST } from "../customTypes";
import Results from "./Results";

export default function Pokemon() {
  const { currTypes, setCurrTypes, pokeMatchups, isLoading } = usePokeTypes();
  const [currPokemon, setCurrPokemon] = useState("");

  async function handleChangeCurrPokemon(pokemon: string) {
    setCurrPokemon(pokemon);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`)
    const pokemonData:Pokemon = await res.json();
    
    setCurrTypes(pokemonData.types.map((t) => t.type.name))
  }

  return (
    <>
      {currPokemon}
      <PokeInput handleChangeCurr={handleChangeCurrPokemon} />
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

      <button onClick={() => {
        setCurrTypes([])
        setCurrPokemon('')
      }}>
        Clear types
      </button>
      
      {isLoading ? 'Loading...' : <Results currTypes={currTypes} pokeMatchups={pokeMatchups} />}
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

  function toRemovedArray<T>(input: T, array: T[]): T[] {
    const index = array.indexOf(input);
    let newArray = array.slice();
    if (index > -1) {
      newArray.splice(index, 1);
    }
    return newArray;
  }
}
