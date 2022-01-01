import * as React from "react";
import useLatest from "./useLatest";
import usePreviousValue from "./usePreviousValue";

const useOnChange = <T>(value: T, onChange: (current: T) => void): void => {
  const cachedOnChange = useLatest(onChange);
  const prevValue = usePreviousValue(value);

  React.useEffect(() => {
    if (value !== prevValue) cachedOnChange.current(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prevValue]);
};

export default useOnChange;
