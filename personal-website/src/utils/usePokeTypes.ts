import { useEffect, useState } from "react";
import { NamedAPIResource, Type } from "../pokeApiTypes";
import { typedJson } from "./Utils";
import { Matchups, PokeTypes, pokeTypesList } from "../customTypes";

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

            newMatchups.weaknesses.push(...APItoArr(relations.double_damage_from));
            newMatchups.strengths.push(...APItoArr(relations.half_damage_from));
            newMatchups.nulls.push(...APItoArr(relations.no_damage_from));
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
          strongMatchupsWhereTypePresent = toDeletedArr(strongMatchupsWhereTypePresent, "strengths")
        }
        if (weakMatchupsWhereTypePresent.length > 1) {
          newMatchups.weaknesses = toDeletedArr(newMatchups.weaknesses, type)
          weakMatchupsWhereTypePresent = toDeletedArr(weakMatchupsWhereTypePresent, "weaknesses")

        }

        let allMatchupsWherePresent = [...(strongMatchupsWhereTypePresent), ...(weakMatchupsWhereTypePresent)]
        if (allMatchupsWherePresent.length > 1) {
          allMatchupsWherePresent.map((matchup) => {
            newMatchups[matchup] = toDeletedArr(newMatchups[matchup], type)
          })
        }
      })

      for (const type of newMatchups.nulls) {
        Object.keys(newMatchups).map((matchup) => {
          if (matchup !== "nulls") {
            newMatchups[matchup as keyof Matchups] = toDeletedArr(newMatchups[matchup as keyof Matchups], type as PokeTypes)
          }
        })
      }

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

function APItoArr(api: NamedAPIResource[]): PokeTypes[] {
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
  return toUniqueArr(dupedTypes);
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