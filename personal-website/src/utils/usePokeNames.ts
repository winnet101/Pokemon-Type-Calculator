import { useEffect, useState } from "react";
import type { PokemonAPIResource, PokemonList } from "../types";
import { typedJson } from "./Utils";

const count = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1");
const count_res = await count.json();
// gets total number of pkmn so we can load it in one object :D

const BASE_URL = `https://pokeapi.co/api/v2/pokemon/?limit=${count_res.count}`;

function usePokeNames() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [pokemon, setPokemon] = useState<PokemonAPIResource[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetchPokemon()
      .then((res) => typedJson<PokemonList>(res))
      .then((data) => {
        setPokemon(data.results);
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setHasError(true);
      });

    return () => {
      setIsLoading(false);
      setHasError(false);
    };

    async function fetchPokemon() {
      const promise = await fetch(BASE_URL);
      return promise;
    }
  }, []);

  return { pokemon, isLoading, hasError };
}

export default usePokeNames;
