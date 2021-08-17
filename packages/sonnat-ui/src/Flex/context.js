import { createContext } from "react";

const FlexContext = createContext({
  isColumn: false
});

if (process.env.NODE_ENV !== "production")
  FlexContext.displayName = "FlexContext";

export default FlexContext;
