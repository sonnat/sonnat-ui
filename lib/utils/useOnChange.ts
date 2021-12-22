import * as React from "react";
import useGetLatest from "./useGetLatest";
import usePreviousValue from "./usePreviousValue";

const useOnChange = <T>(value: T, onChange: (current: T) => void): void => {
  const getLatestOnChange = useGetLatest(onChange);
  const prevValue = usePreviousValue(value);

  React.useEffect(() => {
    const latestOnChange = getLatestOnChange();

    if (value !== prevValue && latestOnChange) latestOnChange(value);
  }, [value, prevValue, getLatestOnChange]);
};

export default useOnChange;
