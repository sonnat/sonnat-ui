import * as React from "react";

const useLatest = <T>(value: T) => {
  const ref = React.useRef<T>(value);

  React.useEffect(() => void (ref.current = value));

  return ref;
};

export default useLatest;
