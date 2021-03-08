import { createContext } from "react";

const InputBaseContext = createContext({
  size: "medium",
  disabled: false,
  hasError: false
});

if (process.env.NODE_ENV !== "production") {
  InputBaseContext.displayName = "InputBaseContext";
}

export default InputBaseContext;
