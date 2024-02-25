import { useEffect, useRef, useState } from "react";
import type { NamedAPIResource, PokeTypes, Type } from "../types";
import { pokeTypesList } from "../types";
import { typedJson } from "../utils/Utils";
import styles from "../styles/Pokemon.module.css";
import StringInput from "../utils/StringInput";
import TypeButton from "./TypeButton";

export default function Pokemon() {
  const [currTypes, setCurrTypes] = useState<PokeTypes[]>([]);
  const [input, setInput] = useState("");

  /** @todo Turn this into a single object.*/
  const [weaknesses, setWeaknesses] = useState<PokeTypes[]>([]);
  const [strengths, setStrengths] = useState<PokeTypes[]>([]);
  const [nulls, setNulls] = useState<PokeTypes[]>([]);

  const disabled = useRef(false);
  const prevTypes = useRef<PokeTypes[]>([]);

  useEffect(() => {

    const currentEqPrev =
      currTypes.every((el) => prevTypes.current.includes(el)) &&
      prevTypes.current.every((el) => currTypes.includes(el));

    prevTypes.current = currTypes.slice();

    if (currTypes.length >= 2) {
      disabled.current = true;
    } else {
      disabled.current = false;
    }

    /** @todo Also make this a single object. */
    let newWeaknesses: PokeTypes[] = [];
    let newStrengths: PokeTypes[] = [];
    let newNulls: PokeTypes[] = [];

    if (!currentEqPrev) {
      for (const pt of pokeTypesList) {
        if (currTypes.includes(pt)) {
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

              for (const pt of pokeTypesList) {
                if (newStrengths.includes(pt)) {
                  newStrengths.splice(newStrengths.indexOf(pt), 1);
                  if (newStrengths.includes(pt)) {
                  }
                }

                // check overlap
                if (newStrengths.includes(pt) && newWeaknesses.includes(pt)) {
                  newStrengths.splice(newStrengths.indexOf(pt), 1);
                  newWeaknesses.splice(newWeaknesses.indexOf(pt), 1);
                }

                // check null overlap
                if (newNulls.includes(pt)) {
                  if (newStrengths.includes(pt)) {
                    newStrengths;
                  }
                  if (newWeaknesses.includes(pt)) {
                    newWeaknesses.splice(newWeaknesses.indexOf(pt), 1);
                  }
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

    // functions
    function arrToNewTypes(
      origArr: PokeTypes[],
      currentApiObj: NamedAPIResource[]
    ) {
      const current = toArr(currentApiObj) as PokeTypes[];
      const newArr = [...origArr, ...current];
      return newArr;
    }

    async function fetchType(type: PokeTypes) {
      const data = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);
      return data;
    }
  }, [currTypes]);

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
      
      <div>
        {" "}
        {/* parse this for icons to add */}
        Weak to: {(weaknesses.toString()) ? weaknesses.join(" ") : "none"}
        <br />
        Resists: {strengths.toString() ? strengths.join(" ") : "none"}
        <br />
        Nulls: {nulls.toString() ? nulls.join(" ") : "none"}
      </div>

      <code>
        {currTypes}
      </code>
    </>
  );

  function handleClick(el: PokeTypes) {
    if (!currTypes.includes(el) && !disabled.current) {
      let newTypes = currTypes.slice();
      newTypes.push(el)
      setCurrTypes(newTypes)
    } else {
      const newInput = toRemovedArray(el, currTypes);
      setCurrTypes(newInput);
    }
  }

  function toRemovedArray<T>(input: T, array: T[]): T[] {
    const index = array.indexOf(input);
    let newArray = array.slice();
    if (index > - 1) {
      newArray.splice(index, 1);
    }
    return newArray;
  }

  function toArr(api: NamedAPIResource[]) {
    const arr: string[] = [];
    for (const [_key, value] of Object.entries(api)) {
      arr.push(value.name);
    }
    return arr;
  }
}
