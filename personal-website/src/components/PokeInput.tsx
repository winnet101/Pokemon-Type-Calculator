import { useEffect, useState } from "react";
import StringInput from "../utils/StringInput";
import usePokeNames from "../utils/usePokeNames";
import styles from "../styles/PokeInput.module.css";

export default function PokeInput() {
  // TODO: useState input up a level
  // handle getting types from selected pkmn
  const [input, setInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const { pokemon, isLoading: pokemonIsLoading, hasError } = usePokeNames();

  const pokeNames = pokemon
    .map((api) => {
      return api.name;
    })
    .filter((name) => name.indexOf(input) > -1 && name !== input)
    .filter((name) => !name.includes("-"))
    .slice(0, 10);

  // TODO: make this a custom hook?
  const [imagesIsLoading, setImagesIsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setImagesIsLoading(true);
    fetchImages();

    async function fetchImages() {
      const newImages = await Promise.all(
        pokeNames.map(async (name) => {
          const res = await getPokemon(name);
          const data = await res.json();
          return data.sprites.front_default;
        })
      );
      if (!ignore) {
        setImages(newImages);
        setImagesIsLoading(false);
      }
    }

    return () => {
      setImagesIsLoading(false);
      ignore = true;
    };
  }, [input]);

  async function getPokemon(name: string) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
  }

  // TODO: dropdown only appear on focus (css?)
  return (
    <div className={styles.inputWrap}>
      <StringInput
        value={input}
        onChange={(ev) => setInput(ev)}
        className={styles.input}
      />
      <ul className={styles.list}>
        {input.trim().toLowerCase()
          ? pokemonIsLoading
            ? "Loading..."
            : hasError
            ? "An error has occured. Try reloading."
            : pokeNames.map((name, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setInput(name);
                  }}
                  className={styles.listItem}
                >
                  <span>
                    {name}
                  </span>
                  {imagesIsLoading ? (
                    " | loading..."
                  ) : (
                    <img src={images[i]} width={45} />
                  )}
                </li>
              ))
          : "Input something to get started!"}
      </ul>
    </div>
  );
}
