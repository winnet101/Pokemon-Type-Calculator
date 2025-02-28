import type { PokemonList } from "./poke-api-types/pokeApiTypes";
import useData from "./useData";

async function getCount() {
  const count = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=1");
  const count_res = await count.json();
  return `https://pokeapi.co/api/v2/pokemon/?limit=${count_res.count}`;
}

let BASE_URL = "";
getCount().then((url) => (BASE_URL = url));

function usePokeNames() {
  const { data, isLoading, hasError } = useData<PokemonList>(BASE_URL);
  const pokemon = data ? data.results : [];

  return { pokemon, isLoading, hasError };
}

export default usePokeNames;
