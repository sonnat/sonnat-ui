import * as React from "react";

const setRef = <T>(ref: React.Ref<T>, value: T): void => {
  if (typeof ref === "function") ref(value);
  else if (ref && typeof ref === "object" && "current" in ref)
    (ref as React.MutableRefObject<T>).current = value;
};

export default setRef;
