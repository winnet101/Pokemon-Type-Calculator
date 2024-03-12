import { useEffect, useRef, useState } from "react";
import type { PokeTypes } from "../types";
import { pokeTypesList } from "../types";
import styles from "../styles/Pokemon.module.css";
import StringInput from "../utils/StringInput";
import TypeButton from "./TypeButton";
import usePokeTypes from "../utils/usePokeTypes";

export default function Pokemon() {
  const [input, setInput] = useState("");
  const disabled = useRef(false);

  const {currTypes, setCurrTypes, pokeMatchups, isLoading } = usePokeTypes();


  // /** @todo Turn this into a single object.*/
  // const [weaknesses, setWeaknesses] = useState<PokeTypes[]>([]);
  // const [strengths, setStrengths] = useState<PokeTypes[]>([]);
  // const [nulls, setNulls] = useState<PokeTypes[]>([]);

  // const prevTypes = useRef<PokeTypes[]>([]);

  // useEffect(() => {
  //   const fetchTimeout = setTimeout(() => {
  //     if (input.trim() !== "") {
  //       fetchMon(input.toLowerCase())
  //         .then((data) => typedJson(data))
  //         .then((mon) => {
  //           // @ts-expect-error
  //           const apiTypes: Object[] = mon.types;
  //           const newTypes = apiTypes.map((api) => {
  //             // @ts-expect-error
  //             return api.type.name
  //           })
            
  //           setCurrTypes(newTypes)

  //         })
  //         .catch((err) => console.log(err))
  //     }
  //   }, 500);

  //   async function fetchMon(mon: string) {
  //     const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${mon}/`);
  //     return data;
  //   }

  //   return () => clearTimeout(fetchTimeout);
  // }, [input]);

  return (
    <>
      <StringInput
        value={input}
        onChange={(el) => {
          setInput(el);
        }}
        className={styles.input}
      />
      <div className={styles.buttonContainer}>
        {pokeTypesList.map((el, i) => (
          <TypeButton
            key={i}
            el={el}
            handleClick={handleClick}
            className={`
            ${styles.button}
            ${currTypes.includes(el) && styles.selected}
          `}
          />
        ))}
      </div>

      <code>{currTypes}</code><br />
      <code>{isLoading ? "Loading..." : pokeMatchups.weaknesses}</code>
    </>
  );

  function handleClick(type: PokeTypes) {
    if (!currTypes.includes(type)) {
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
