import { ButtonHTMLAttributes } from "react";
import { PokeTypes } from "../types";
// import {
//   bug,
//   dark,
//   dragon,
//   electric,
//   fairy,
//   fighting,
//   fire,
//   flying,
//   ghost,
//   grass,
//   ground,
//   ice,
//   normal,
//   poison,
//   psychic,
//   rock,
//   steel,
//   water,
// } from "../images.ts"

export default function TypeButton({
  el,
  handleClick,
  ...otherProps
}: {
  el: PokeTypes;
  handleClick: (el: PokeTypes) => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">) {

  return (
    <button
      onClick={() => {
        handleClick(el);
      }}
      {...otherProps}
    >
      <div>{el}</div>
      <img height={25} src={`/Pokemon-Type-Calculator/src/assets/${el}.png`} alt="" />
    </button>
  );
}
