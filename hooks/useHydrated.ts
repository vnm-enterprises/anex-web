import { useEffect, useState } from "react";

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const fn = async () => {
      setHydrated(true);
    }

    fn();

  }, []);

  return hydrated;
}
