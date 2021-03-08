import { createContext } from "react";

const RadioGroupContext = createContext();

if (process.env.NODE_ENV !== "production") {
  RadioGroupContext.displayName = "RadioGroupContext";
}

export default RadioGroupContext;
