import { useMemo } from "react";
import setRef from "./setRef";

export default function useForkRef(refA, refB) {
  return useMemo(() => {
    if (refA === null && refB === null) return null;

    return value => {
      if (refA) setRef(refA, value);
      if (refB) setRef(refB, value);
    };
  }, [refA, refB]);
}
