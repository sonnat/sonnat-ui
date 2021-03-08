import { createContext } from "react";

const TextFieldContext = createContext({
  isEmpty: true
});

if (process.env.NODE_ENV !== "production") {
  TextFieldContext.displayName = "TextFieldContext";
}

export default TextFieldContext;
