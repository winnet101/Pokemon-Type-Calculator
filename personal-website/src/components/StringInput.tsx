import { InputHTMLAttributes } from "react";

function StringInput({
  value, 
  onChange, 
  ...otherProps
}: {
  value?: string;
  onChange?: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  return (
    <input 
      value={value}
      onChange={
        onChange ? e => onChange(e.target.value) : undefined
      }
      {...otherProps}
    />
  )
}

export default StringInput;