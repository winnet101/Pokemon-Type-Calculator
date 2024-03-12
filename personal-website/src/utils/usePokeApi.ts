import { useState } from "react";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon/?limit=1302";

function usePokeApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [pokemon, setPokemon] = useState<string[]>([]);

  async function fetchPokemon() {
    try {
      setIsLoading(true);
      fetch(BASE_URL)
        .then((res) => res.json())
        .then((data) => setPokemon(data.results.map((pokemon:any) => pokemon.name)))
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return {pokemon, isLoading, hasError, fetchPokemon}

}


export default usePokeApi;