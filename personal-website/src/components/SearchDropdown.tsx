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
      ...otherProps
    },
    ref
  ) => {
    if (pokeNames.length < 1) {
      return (
        <div className={styles.list}>
          Enter the name of a Pokemon to autofill its types.
        </div>
      );
    }

    if (namesIsLoading) {
      return <div className={styles.list}>Loading...</div>;
    }

    if (hasError) {
      return (
        <div className={styles.list}>
          There was an error loading autocomplete results. Try reloading the
          page.
        </div>
      );
    }

    return (
      <ul className={styles.list} ref={ref} {...otherProps}>
        {pokeNames.map((name, i) => (
          <li
            key={i}
            onClick={() => setInput(name)}
            className={styles.listItem}
            ref={(el) => {
              if (el) {
                liRefs.current.set(name, el);
              }
            }}
            style={{
              outline: `${selectedRefs === i ? "solid" : ""}`,
            }}
          >
            <span>{name}</span>
            <span>
              {imagesIsLoading ? (
                " | Loading..."
              ) : (
                <img src={images[i]} width={45} />
              )}
            </span>
          </li>
        ))}
      </ul>
    );
  }
);

export default SearchDropdown;
