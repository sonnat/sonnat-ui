import { createContext } from "react";

const SelectContext = createContext({
  isMultiple: false
});

if (process.env.NODE_ENV !== "production")
  SelectContext.displayName = "SelectContext";

export default SelectContext;
