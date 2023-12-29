import {useState, useEffect} from "react";

export default function useLocalStorage(key, initialValue) {
  const storedValue = 
  (localStorage.getItem(key)) || initialValue;

  const [value, setValue] = useState(storedValue);

  useEffect(() => {
    (localStorage.setItem(key, value));
  }, [key, value]);

  return [value, setValue];
}