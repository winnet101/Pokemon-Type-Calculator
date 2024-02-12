import { useEffect, useState } from "react";
import type { NamedAPIResource, PokeTypes, Type } from "../types";
import { typedJson, apiResourceToArray as toArr } from "../utils/Utils";
import styles from "../styles/Pokemon.module.css";
import StringInput from "../utils/StringInput";

export default function Pokemon() {
  const [input, setInput] = useState("");
  const pokeTypes: PokeTypes[] = [
    "normal",
    "fighting",
    "flying",
    "poison",
    "ground",
    "rock",
    "bug",
    "ghost",
    "steel",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy",
  ];

  /** @todo Turn this into a single object.*/
  const [weaknesses, setWeaknesses] = useState<PokeTypes[]>([]);
  const [strengths, setStrengths] = useState<PokeTypes[]>([]);
  const [nulls, setNulls] = useState<PokeTypes[]>([]);

  useEffect(() => {
    const typedArrInput:PokeTypes[] = [];
    for (const pt of pokeTypes) {
      if (input.search(pt)) {
        typedArrInput.push(pt);
      }
    }

    /** @todo Also make this a single object. */
    let newWeaknesses: PokeTypes[] = [];
    let newStrengths: PokeTypes[] = [];
    let newNulls: PokeTypes[] = [];

    for (const pt of pokeTypes) {
      if (input.toLowerCase().includes(pt)) {
        fetchType(pt)
          .then((res) => typedJson<Type>(res))
          .then((data) => {
            const relations = data.damage_relations;

            newWeaknesses = arrToNewTypes(
              newWeaknesses,
              relations.double_damage_from
            );
            newStrengths = arrToNewTypes(
              newStrengths,
              relations.half_damage_from
            );
            /** @todo check overlaps */

            newNulls = arrToNewTypes(newNulls, relations.no_damage_from);

            setWeaknesses(newWeaknesses);
            setStrengths(newStrengths);
            setNulls(newNulls);
          })
          .catch(console.error);
      } else {
        setWeaknesses([]);
        setStrengths([]);
        setNulls([]);
      }
    }

    /** Adds a NamedAPIResource list of types to the current array of types being tracked (weaknesses, strengths, or nulls.)
     * @param origArr: The current array of types being operated on.
     * @param currentApiObj: The NamedAPIResource to add.
     * @returns: An array of types with the new types from the APIResource added.
     *
     */
    function arrToNewTypes(
      origArr: PokeTypes[],
      currentApiObj: NamedAPIResource[]
    ) {
      const current = toArr(currentApiObj) as PokeTypes[];
      const newArr = [...origArr, ...current];
      return [...new Set(newArr)];
    }

    async function fetchType(type: PokeTypes) {
      const data = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);
      return data;
    }
  }, [input]);

  function toRemoved(input: PokeTypes[], remove: PokeTypes): PokeTypes[] {
    const newInput = input.filter(el => el !== remove);
    return newInput;
  }

  return (
    <>
      <StringInput 
        value={input}
        onChange={(el) => setInput(el)}
      />
      {pokeTypes.map((el, i) => (
        <button
          key={i}
          onClick={() => {
            handleClick(el);
          }}
          className={`
            ${input.toLowerCase().includes(el) && styles.selected}
          `}
        >
          {el}
        </button>
      ))}
      <div>
        Weaknesses: {weaknesses.toString() ? weaknesses.join(" ") : "none"}
        <br />
        Strengths: {strengths.toString() ? strengths.join(" ") : "none"}
        <br />
        Nulls: {nulls.toString() ? nulls.join(" ") : "none"}
      </div>
    </>
  );

  function handleClick(el: PokeTypes) {
    if (!input.toLowerCase().includes(el)) {
      let newInput = input.slice();
      setInput(`${newInput.trim()}${el}`);
    } else {
      const newInput = toRemovedString(input.slice(), el);
      setInput(newInput);
    }
  }

  function toRemovedString(input:string, remove: PokeTypes):string {
    const newInput = input.split(new RegExp(remove, "i")).join("");
    return newInput;
  }
}
