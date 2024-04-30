import { useState } from "react";
import type { PokeTypes } from "../types";
import { pokeTypesList } from "../types";
import styles from "../styles/Pokemon.module.css";
import TypeButton from "./TypeButton";
import usePokeTypes from "../utils/usePokeTypes";
import PokeInput from "./PokeInput";

export default function Pokemon() {
  const { currTypes, setCurrTypes, pokeMatchups, isLoading } = usePokeTypes();
  const [currPokemon, setCurrPokemon] = useState("");

  // const [_images, setImages] = useState<any[]>([]);
  // useEffect(() => {
  //   const imageModules = import.meta.glob("../assets/*");

  //   let newPromises: Promise<any>[] = [];
  //   for (const path of Object.values(imageModules)) {
  //     newPromises.push(fetchPath(path));
  //   }

  //   Promise.all(newPromises).then((newImages) => {
  //     const newPaths = newImages.map((img) => img.default);
  //     console.log(newPaths)
  //     setImages(newPaths);
  //   });

  //   // functions
  //   async function fetchPath(path: () => Promise<any>) {
  //     return await path();
  //   }
  // }, []);

  function handleChangeCurrPokemon(pokemon:string) {
    setCurrPokemon(pokemon)
  }

  return (
    <>
      {currPokemon}
      <PokeInput handleChangeCurr={handleChangeCurrPokemon} />
      <div className={styles.buttonContainer}>
        {pokeTypesList.map((type, i) => (
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

      <code>
        <h1 style={{ margin: 0, padding: 0 }}>
          {currTypes[0] ? currTypes : "none"}
        </h1>
        {Object.entries(pokeMatchups).map(([matchup, types], i) => (
          <div key={i}>
            {matchup}: {isLoading ? "Loading..." : types.join(", ")}
          </div>
        ))}
      </code>
    </>
  );

  function handleClick(type: PokeTypes) {
    if (!currTypes.includes(type) && currTypes.length < 2) {
      let newTypes = currTypes.slice();
      newTypes.push(type);
      setCurrTypes(newTypes);
    } else {
      const newInput = toRemovedArray(type, currTypes);
      setCurrTypes(newInput);
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
