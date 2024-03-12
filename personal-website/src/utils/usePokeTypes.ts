import { useEffect, useState } from "react";
import { NamedAPIResource, PokeTypes, Type } from "../types";
import { typedJson } from "./Utils";

type Matchups = {
  double_weak: PokeTypes[];
  weaknesses: PokeTypes[];
  strengths: PokeTypes[];
  double_strengths: PokeTypes[];
  nulls: PokeTypes[];
};

function usePokeTypes() {
  const [currTypes, setCurrTypes] = useState<PokeTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pokeMatchups, setPokeMatchups] = useState<Matchups>({
    double_weak: [],
    weaknesses: [],
    strengths: [],
    double_strengths: [],
    nulls: [],
  });

  useEffect(() => {
    setIsLoading(true);

    async function fetchTypeData() {
      const newMatchups: Matchups = {
        double_weak: [],
        weaknesses: [],
        strengths: [],
        double_strengths: [],
        nulls: [],
      };

      // like the image-loading thing, do this or they won't all make it to state
      await Promise.all(
        currTypes.map(async (type) => {
          try {
            const res = await fetch(TYPE_PATH(type));
            const data = await typedJson<Type>(res);
            const relations = data.damage_relations;

            newMatchups.weaknesses.push(...toArr(relations.double_damage_from));
            newMatchups.strengths.push(...toArr(relations.half_damage_from));
            newMatchups.nulls.push(...toArr(relations.no_damage_from));
          } catch(error) {
            console.error(error);
          }
        })
      );

      newMatchups.double_weak = getDupedTypes(newMatchups.weaknesses);
      newMatchups.double_strengths = getDupedTypes(newMatchups.strengths);
      newMatchups.weaknesses = toUnique(newMatchups.weaknesses);
      newMatchups.strengths = toUnique(newMatchups.strengths);
      newMatchups.nulls = toUnique(newMatchups.nulls);

      // check overlaps

      setPokeMatchups(newMatchups);
      setIsLoading(false);
    }

    fetchTypeData();

    return () => {
      setIsLoading(false);
    };
  }, [currTypes]);

  return { currTypes, setCurrTypes, pokeMatchups, isLoading };
}

export default usePokeTypes;

// --- utils ---

function toArr(api: NamedAPIResource[]): PokeTypes[] {
  const arr: PokeTypes[] = [];
  for (const [_key, value] of Object.entries(api)) {
    arr.push(value.name);
  }
  return arr;
}

function getDupedTypes<T>(types: T[]) {
  let dupedTypes: T[] = [];
  for (const type in types) {
    const typesWithRemoved = types
      .slice() 
      .splice(types.indexOf(type as T), 1);
    if (type in typesWithRemoved) {
      dupedTypes.push(type as T);
    }
  }
  return dupedTypes;
}

function toUnique<T>(arr: T[]) {
  const newArr = [...new Set(arr)];
  return newArr;
}

function TYPE_PATH(type: PokeTypes) {
  return `https://pokeapi.co/api/v2/type/${type.toLowerCase()}` as const;
}
