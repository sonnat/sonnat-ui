import { createContext } from "react";

const TextFieldContext = createContext();

if (process.env.NODE_ENV !== "production") {
  TextFieldContext.displayName = "TextFieldContext";
}

export default TextFieldContext;
