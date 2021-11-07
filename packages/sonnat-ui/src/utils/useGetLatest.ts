import * as React from "react";

const useGetLatest = <T>(value: T): (() => T) => {
  const ref = React.useRef<T>(value);

  React.useEffect(() => void (ref.current = value));

  return React.useCallback(() => ref.current, []);
};

export default useGetLatest;
