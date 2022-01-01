import * as React from "react";
import useLatest from "./useLatest";

const useGetLatest = <T>(value: T): (() => T) => {
  const ref = useLatest(value);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(() => ref.current, []);
};

export default useGetLatest;
