import { useRef, useMemo, useEffect } from "react";

export default function useSyncEffect(effectFn, dependencies) {
  const key = useRef([]);
  let cleanUpFn;

  // Store "generation" key. Just returns a new object every time
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentKey = useMemo(() => ({}), dependencies);

  // "the first render", or "memo dropped the value"
  if (key.current !== currentKey) {
    key.current = currentKey;
    cleanUpFn = effectFn();
  }

  useEffect(
    () => {
      return () => {
        if (cleanUpFn) cleanUpFn();
      };
    },
    [currentKey] // eslint-disable-line react-hooks/exhaustive-deps
  );
}
