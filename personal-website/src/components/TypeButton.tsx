import { ButtonHTMLAttributes } from "react";
import * as images from "../images";
import { PokeTypes } from "../customTypes";

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
      <img height={25} src={images[el]} alt="" />
    </button>
  );
}
