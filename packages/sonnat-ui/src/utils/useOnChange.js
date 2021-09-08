import * as React from "react";
import usePreviousValue from "./usePreviousValue";

export default function useOnChange(value, onChange) {
  const onChangeRef = React.useRef(onChange);

  const prevValue = usePreviousValue(value);

  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  React.useEffect(() => {
    if (value !== prevValue && onChangeRef.current) {
      onChangeRef.current(value);
    }
  }, [value, prevValue]);
}
