import { useEffect, useRef, useState } from "react";
import usePokeNames from "../utils/usePokeNames";
import styles from "../styles/PokeInput.module.css";
import StringInput from "./StringInput";
import SearchDropdown from "./SearchDropdown";
import { toRemovedArray } from "../utils/utils";

export default function Searchbar({
  input,
  setInput,
  setCurrentPokemon,
  searchResults,
  setSearchResults,
}: {
  input: string;
  setInput: (input: string) => void;
  setCurrentPokemon: (pokemon: string) => void;
  searchResults: string[];
  setSearchResults: (results: string[]) => void;
}) {
  const [images, setImages] = useState<string[]>([]);

  const [pokeNames, isLoading, hasError] = usePokeNames();

  const listItemRefs = useRef<Map<string, HTMLLIElement>>(null as any);
  if (listItemRefs.current === null) {
    listItemRefs.current = new Map();
  }

  const [selectedRefIndex, setSelectedRefIndex] = useState<number | null>(null);

  // TODO: make this a custom hook?
  const [imagesIsLoading, setImagesIsLoading] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

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

  function handleInputChange(newInput: string) {
    setInput(newInput);
    const sanitizedNewInput = newInput.trim().toLowerCase();

    listItemRefs.current.clear();
    setSelectedRefIndex(null);

    if (!sanitizedNewInput) {
      setSearchResults([]);
      return;
    }

    let searchResults = pokeNames
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

  // function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  //   console.log('keydown')
  //   if (e.key === "Tab") {
  //     if (searchResults.length < 1) return;
  //     console.log(listItemRefs.current.size);


  //     if (selectedRefIndex === null) {
  //       e.preventDefault();

  //       setSelectedRefIndex(0);
  //       listItemRefs.current.get(searchResults[0])?.focus();

  //     } else {
  //       const nextRefIndex =
  //         selectedRefIndex === listItemRefs.current.size - 1
  //           ? 0
  //           : selectedRefIndex + 1;

  //       console.log(nextRefIndex)
            

  //       setSelectedRefIndex(nextRefIndex);
  //       listItemRefs.current.get(searchResults[nextRefIndex])?.focus();
  //     }
  //   } else if (e.key === "Enter") {
  //     e.preventDefault();
  //     if (searchResults.length < 1) return;

  //     if (selectedRefIndex !== null) {
  //       listItemRefs.current.get(searchResults[selectedRefIndex])?.click();
  //     }
  //   }
  // }

  return (
    <div
      className={styles.inputWrap}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        // Only blur if we're not focusing another element inside the wrapper
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
    >
      <StringInput
        value={input}
        onChange={handleInputChange}
        // onKeyDown={handleKeyDown}
        className={styles.input}
      />
      {isFocused && 
        <SearchDropdown
          pokeNames={searchResults}
          namesIsLoading={isLoading}
          hasError={hasError}
          images={images}
          imagesIsLoading={imagesIsLoading}
          setInput={handleInputChange}
          liRefs={listItemRefs}
          selectedRefs={selectedRefIndex}
          setIsFocused={setIsFocused}
        />
      }
    </div>
  );
}
