import styles from "../styles/PokeInput.module.css";

export default function SearchDropdown({
  pokeNames,
  namesIsLoading,
  hasError,
  images,
  imagesIsLoading,
  setInput,
}: {
  pokeNames: string[];
  namesIsLoading: boolean;
  hasError: boolean;
  images: string[];
  imagesIsLoading: boolean;
  setInput: (input: string) => void;
}) {
  if (pokeNames.length < 1) {
    return (
      <div className={styles.list}>
        Enter the name of a Pokemon to autofill its types.
      </div>
    )
  }

  if (namesIsLoading) {
    return (
      <div className={styles.list}>
        Loading...
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={styles.list}>
        There was an error loading autocomplete results. Try reloading the page.
      </div>
    )
  }

  return (
    <ul className={styles.list}>
      {pokeNames.map((name, i) => (
        <li key={i} onClick={() => setInput(name)} className={styles.listItem}>
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
