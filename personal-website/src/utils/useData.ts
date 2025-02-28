import { useEffect, useState } from "react";
import { typedJson } from "./utils";

export default function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null as T);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setHasError(false);

    fetch(url)
      .then((res) => typedJson<T>(res))
      .then((data) => {
        if (!ignore) {
          setData(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        setHasError(true);
      });

    return () => {
      ignore = true;
      setIsLoading(false);
      setHasError(false);
    };
  }, [url]);

  return { data, isLoading, hasError };
}

export function useDataArray<T>(urls: string[]) {
  const [data, setData] = useState<T[] | null>(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchEntries() {
      const newData = await Promise.all(
        urls.map(async (url) => {
          try {
            const res = await fetch(url);
            const data = await typedJson<T>(res);
            return data;
          } catch (error) {
            console.error(error);
            setHasError(true);
            return null;
          }
        })
      );
      if (!ignore) {
        setData(newData as T[]);
        setIsLoading(false);
      }
    }

    let ignore = false;
    setIsLoading(true);
    setHasError(false);
    fetchEntries();

    return () => {
      ignore = true;
      setIsLoading(false);
      setHasError(false);
    };
  }, [urls]);

  return {data, isLoading, hasError}
}
