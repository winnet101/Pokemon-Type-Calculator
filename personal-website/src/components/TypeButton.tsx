import { ButtonHTMLAttributes, useEffect, useState } from "react";
import { PokeTypes } from "../types";

export default function TypeButton({
  el,
  handleClick,
  ...otherProps
}: {
  el: PokeTypes;
  handleClick: (el: PokeTypes) => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">) {

  const [_images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const imageModules = import.meta.glob("../assets/*");

    let newPromises: Promise<any>[] = [];
    for (const path of Object.values(imageModules)) {
      newPromises.push(fetchPath(path));
    }

    Promise.all(newPromises)
    .then((newImages) => {
      const newPaths = (newImages.map((img) => img.default));
      setImages(newPaths);
    });

    // functions
    async function fetchPath(path: () => Promise<any>) {
      return await path();
    }
  }, []);

  return (
    <button
      onClick={() => {
        handleClick(el);
      }}
      {...otherProps}
    >
      <div>{el}</div>
      <img height={25} src={`/src/assets/${el}.png`} alt="" />
    </button>
  );
}
