import { createContext } from "react";

const SelectContext = createContext({
  isNative: false
});

if (process.env.NODE_ENV !== "production")
  SelectContext.displayName = "SelectContext";

export default SelectContext;
