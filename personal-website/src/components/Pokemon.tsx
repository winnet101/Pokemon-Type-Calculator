import { useState } from "react";
import type { PokeTypes } from "../types";
import { pokeTypesList } from "../types";
import styles from "../styles/Pokemon.module.css";
import StringInput from "../utils/StringInput";
import TypeButton from "./TypeButton";
import usePokeTypes from "../utils/usePokeTypes";

export default function Pokemon() {
  // TODO: make searching work
  const [input, setInput] = useState("");
  // const disabled = useRef(false);

  const {currTypes, setCurrTypes, pokeMatchups, isLoading} = usePokeTypes();

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

      <code>
        <h1 style={{margin:0, padding:0}}>{(currTypes[0]) ? currTypes : "none"}</h1>
        Weaknesses: {isLoading ? "Loading..." : pokeMatchups.weaknesses}
        <br />
        DOUBLE WEAKNESSES: {isLoading ? "Loading..." : pokeMatchups.double_weak}
        <br />
        Strengths: {isLoading ? "Loading..." : pokeMatchups.strengths}
        <br />
        DOUBLE STRENGTHS: {isLoading ? "Loading..." : pokeMatchups.double_strengths}
        <br />
        Nulls: {isLoading ? "Loading..." : pokeMatchups.nulls}
      </code>
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
