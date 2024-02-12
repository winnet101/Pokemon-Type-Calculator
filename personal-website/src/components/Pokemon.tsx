import { useEffect, useRef, useState } from "react";
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
  
  const disabled = useRef(false);
  const prevTypes = useRef<PokeTypes[]>([]);

  useEffect(() => {
    const currentTypes: PokeTypes[] = [];
    for (const pt of pokeTypes) {
      if (input.includes(pt)) {
        currentTypes.push(pt);
      }
    }

    const currentEqPrev =
      currentTypes.every((el) => prevTypes.current.includes(el)) &&
      prevTypes.current.every((el) => currentTypes.includes(el));

    prevTypes.current = currentTypes;

    if (currentTypes.length >= 2) {
      disabled.current = true;
    } else {
      disabled.current = false;
    }

    /** @todo Also make this a single object. */
    let newWeaknesses: PokeTypes[] = [];
    let newStrengths: PokeTypes[] = [];
    let newNulls: PokeTypes[] = [];

    if (!currentEqPrev) {
      for (const pt of pokeTypes) {
        if (input.toLowerCase().includes(pt)) {
          console.log("fetching");
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
              newNulls = arrToNewTypes(newNulls, relations.no_damage_from);

              for (const pt of pokeTypes) {
                if (newStrengths.includes(pt) && newWeaknesses.includes(pt)) {
                  newStrengths.splice(newStrengths.indexOf(pt), 1);
                  newWeaknesses.splice(newWeaknesses.indexOf(pt), 1);
                }

                if (
                  newNulls.includes(pt) &&
                  (newStrengths.includes(pt) || newWeaknesses.includes(pt))
                ) {
                  newStrengths.splice(newStrengths.indexOf(pt), 1);
                  newWeaknesses.splice(newWeaknesses.indexOf(pt), 1);
                }
              }

              setStrengths(newStrengths);
              setWeaknesses(newWeaknesses);
              setNulls(newNulls);
            })
            .catch(console.error);
        } else {
          setWeaknesses([]);
          setStrengths([]);
          setNulls([]);
        }
      }
    }

    // function defs

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

  return (
    <>
      <StringInput
        value={input}
        onChange={(el) => {
          setInput(el);
        }}
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
        Weak to: {weaknesses.toString() ? weaknesses.join(" ") : "none"}
        <br />
        Resists: {strengths.toString() ? strengths.join(" ") : "none"}
        <br />
        Nulls: {nulls.toString() ? nulls.join(" ") : "none"}
      </div>
    </>
  );

  function handleClick(el: PokeTypes) {
    if (!input.toLowerCase().includes(el) && !disabled.current) {
      let newInput = input.slice();
      setInput(`${newInput.trim()}${el}`);
    } else {
      const newInput = toRemovedString(input.slice(), el);
      setInput(newInput);
    }
  }

  function toRemovedString(input: string, remove: PokeTypes): string {
    const newInput = input.split(new RegExp(remove, "i")).join("");
    return newInput;
  }
}
