import { useEffect, useState } from "react";
import { typedJson } from "./Utils";

export default function useData<T>(url: string) {
  const [data, setData] = useState(null as T);

  useEffect(() => {
    let ignore = false;

    fetch(url)
      .then((res) => typedJson<T>(res))
      .then((data) => {
        if (!ignore) {
          setData(data);
        }
      });

    return () => {
      ignore = true;
    };
  }, [url]);

  return data;
}
