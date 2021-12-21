import * as React from "react";

const usePreviousValue = <T>(value: T): T | undefined => {
  const ref = React.useRef<T>();

  React.useEffect(() => void (ref.current = value), [value]);

  return ref.current;
};

export default usePreviousValue;
