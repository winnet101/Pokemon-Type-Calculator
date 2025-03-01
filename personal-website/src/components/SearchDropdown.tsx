import { forwardRef, MutableRefObject, useEffect } from "react";
import styles from "../styles/PokeInput.module.css";
import { toRemovedArray } from "../utils/utils";

interface SearchDropdownProps extends React.ComponentPropsWithoutRef<"ul"> {
  pokeNames: string[];
  namesIsLoading: boolean;
  hasError: boolean;
  images: string[];
  imagesIsLoading: boolean;
  liRefs: MutableRefObject<Map<string, HTMLLIElement>>;
  selectedRefs: number | null;
  setInput: (input: string) => void;
  setIsFocused: (isFocused: boolean) => void
}

const SearchDropdown = forwardRef<HTMLUListElement, SearchDropdownProps>(
  (
    {
      pokeNames,
      namesIsLoading,
      hasError,
      images,
      imagesIsLoading,
      liRefs,
      selectedRefs,
      setInput,
      setIsFocused,
      ...otherProps
    },
    ref
  ) => {
    if (pokeNames.length < 1) {
      return (
        <div className={styles.dropdown}>
          Enter the name of a Pokemon to autofill its types.
        </div>
      );
    }

    return (
      <div className={styles.dropdown}>
        {hasError ? (
          <div className={styles.error}>Failed to load Pokémon</div>
        ) : namesIsLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          pokeNames.map((name, index) => (
            <li
              key={name}
              className={styles.dropdownItem}
              ref={(el) => el && liRefs.current.set(name, el)}
              tabIndex={0}
              onClick={() => {
                setInput(name)
                setIsFocused(false)
              }}
            >
              {imagesIsLoading ? (
                <span 
                className={styles.pokemonImage} />
              ) : (
                <img
                  src={images[index]}
                  alt={name}
                  className={styles.pokemonImage}
                />
              )}
              <span className={styles.pokemonName}>{name}</span>
            </li>
          ))
        )}
      </div>
    );
  }
);

export default SearchDropdown;
