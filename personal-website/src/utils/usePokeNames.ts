import { useEffect, useState } from "react";
import type {
  PokemonAPIResource,
  PokemonList,
} from "./poke-api-types/pokeApiTypes";

const FULL_LIST_KEY = "FULL_LIST";
const LENGTH_KEY = "FULL_LIST_LENGTH";

function usePokeNames() {
  const [list, setList] = useState<PokemonAPIResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let unmounted = false;

    async function fetchTotalCount() {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1");
      const list: PokemonList = await res.json();

      localStorage.setItem(LENGTH_KEY, JSON.stringify(list.count));
      return list.count;
    }

    async function fetchFullList(count: number) {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${count}`
      );
      const list: PokemonList = await res.json();
      return list.results;
    }

    async function getList() {
      const prev_count_json = localStorage.getItem(LENGTH_KEY);
      const prev_count = prev_count_json ? JSON.parse(prev_count_json) : 0;

      const count = await fetchTotalCount();
      const prev_list_json = localStorage.getItem(FULL_LIST_KEY);

      try {
        if (count !== prev_count) {
          console.log("Count changed from past update.");
          const list = await fetchFullList(count);
          
          localStorage.setItem(LENGTH_KEY, JSON.stringify(count));
          localStorage.setItem(FULL_LIST_KEY, JSON.stringify(list));
          return list;
        } else if (!prev_list_json) {
          console.log("Saved list not detected.");

          const list = await fetchFullList(count);
          localStorage.setItem(FULL_LIST_KEY, JSON.stringify(list));
          return list;
        } else {
          console.log("Loading previous list.");
          return JSON.parse(prev_list_json) as PokemonAPIResource[];
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function main() {
      setIsLoading(true);
      const list = await getList();
      setIsLoading(false);

      if (!unmounted && list) {
        setList(list);
        setHasError(false);
      } else {
        setHasError(true);
      }
    }

    main();

    return () => {
      unmounted = true;
    };
  }, []);

  return [list, isLoading, hasError] as const;
}

export default usePokeNames;
