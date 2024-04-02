import { useEffect, useState } from "react";
import { NamedAPIResource, PokeTypes, Type, pokeTypesList } from "../types";
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

  const TYPE_PATH = (type: PokeTypes) => {
    return `https://pokeapi.co/api/v2/type/${type}` as const;
  }

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

            newMatchups.weaknesses.push(...fromAPItoArr(relations.double_damage_from));
            newMatchups.strengths.push(...fromAPItoArr(relations.half_damage_from));
            newMatchups.nulls.push(...fromAPItoArr(relations.no_damage_from));
          } catch (error) {
            console.error(error);
          }
        })
      );

      newMatchups.double_weak = toDupedElements(newMatchups.weaknesses);
      newMatchups.double_strengths = toDupedElements(newMatchups.strengths);
      newMatchups.weaknesses = toUniqueArr(newMatchups.weaknesses);
      newMatchups.strengths = toUniqueArr(newMatchups.strengths);
      newMatchups.nulls = toUniqueArr(newMatchups.nulls);

      // check nonnull overlaps

      pokeTypesList.map((type) => {
        let strongMatchupsWhereTypePresent:(keyof Matchups)[] = []
        let weakMatchupsWhereTypePresent:(keyof Matchups)[] = []
        for (const [matchup, matchupTypes] of Object.entries(newMatchups)) {
          if (matchupTypes.includes(type) && matchup !== "nulls") {
            if (matchup.includes("strength")) {
              strongMatchupsWhereTypePresent.push(matchup as keyof Matchups)
            } else if (matchup.includes("weak")) {
              weakMatchupsWhereTypePresent.push(matchup as keyof Matchups)
            }
          }
        }

        if (strongMatchupsWhereTypePresent.length > 1) {
          newMatchups.strengths = toDeletedArr(newMatchups.strengths, type)
        }
        if (weakMatchupsWhereTypePresent.length > 1) {
          newMatchups.weaknesses = toDeletedArr(newMatchups.weaknesses, type)
        }

        // TODO: for some reason this is breaking some super effective matchups (i d k)
        // test case: Normal / Dark
        let allMatchupsWherePresent = [...(strongMatchupsWhereTypePresent), ...(weakMatchupsWhereTypePresent)]
        if (allMatchupsWherePresent.length > 1) {
          allMatchupsWherePresent.map((matchup) => {
            newMatchups[matchup] = toDeletedArr(newMatchups[matchup], type)
          })
        }
      })

      // TODO: check null overlaps

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

function fromAPItoArr(api: NamedAPIResource[]): PokeTypes[] {
  const arr: PokeTypes[] = [];
  for (const [_key, value] of Object.entries(api)) {
    arr.push(value.name);
  }
  return arr;
}

function toDupedElements<T extends string>(types: T[]) {
  let dupedTypes: T[] = [];
  types.map((type) => {
    let typesWithRemoved = types.slice() 
    typesWithRemoved.splice(typesWithRemoved.indexOf(type as T), 1);

    if (typesWithRemoved.includes(type as T)) {
      dupedTypes.push(type as T);
    }
  })
  return dupedTypes;
}

function toDeletedArr<T extends string>(types: T[], deletedElement: T) {
  let typesWithRemoved = types.slice() 
  while (typesWithRemoved.includes(deletedElement)) {
    typesWithRemoved.splice(types.indexOf(deletedElement), 1);
  }
  return typesWithRemoved;
}

function toUniqueArr<T>(arr: T[]) {
  const newArr = [...new Set(arr)];
  return newArr;
}