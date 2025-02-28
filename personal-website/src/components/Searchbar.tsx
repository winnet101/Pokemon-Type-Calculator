import { useEffect, useState } from "react";
import usePokeNames from "../utils/usePokeNames";
import styles from "../styles/PokeInput.module.css";
import StringInput from "./StringInput";
import SearchDropdown from "./SearchDropdown";
import { toRemovedArray } from "../utils/utils";

export default function Searchbar({
  input,
  setInput,
  setCurrentPokemon,
}: {
  input: string;
  setInput: (input: string) => void;
  setCurrentPokemon: (pokemon: string) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const { pokemon, isLoading, hasError } = usePokeNames();

  // TODO: make this a custom hook?
  const [imagesIsLoading, setImagesIsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setImagesIsLoading(true);

    async function fetchImages() {
      const newImages = await Promise.all(
        searchResults.map(async (name) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
          const data = await res.json();
          return data.sprites.front_default;
        })
      );
      if (!ignore) {
        setImages(newImages);
        setImagesIsLoading(false);
      }
    }

    // Debounces fetching images by 200 ms
    const delay = setTimeout(fetchImages, 200);

    return () => {
      clearTimeout(delay);
      setImagesIsLoading(false);
      ignore = true;
    };
  }, [input]);

  function onInputChange(newInput: string) {
    console.log(newInput);
    setInput(newInput);
    const sanitizedNewInput = newInput.trim().toLowerCase();

    if (!sanitizedNewInput) {
      setSearchResults([]);
      return;
    }

    let searchResults = pokemon
      // Map all pokemon to names
      .map((api) => {
        return api.name;
      })
      // Return only names that include the input
      .filter((name) => name.indexOf(newInput) > -1)
      .slice(0, 10); // Return only the first 10

    if (searchResults.find((name) => name === newInput)) {
      setCurrentPokemon(newInput);
      searchResults = toRemovedArray(newInput, searchResults);
    }

    setSearchResults(searchResults);
  }

  return (
    <div
      className={styles.inputWrap}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <StringInput
        value={input}
        onChange={onInputChange}
        className={styles.input}
      />
      {(
        <SearchDropdown
          pokeNames={searchResults}
          namesIsLoading={isLoading}
          hasError={hasError}
          images={images}
          imagesIsLoading={imagesIsLoading}
          setInput={onInputChange}
        />
      )}
    </div>
  );
}
