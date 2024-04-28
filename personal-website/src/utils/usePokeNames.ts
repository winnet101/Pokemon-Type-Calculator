import type { PokemonList } from "../types";
import useData from "./useData";

const count = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1");
const count_res = await count.json();

const BASE_URL = `https://pokeapi.co/api/v2/pokemon/?limit=${count_res.count}`;

function usePokeNames() {
  const {data, isLoading, hasError} = useData<PokemonList>(BASE_URL);

  const pokemon = data ? data.results : [];

  return { pokemon, isLoading, hasError };
}

export default usePokeNames;
