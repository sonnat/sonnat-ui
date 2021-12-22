import * as React from "react";

interface IContext {
  isEmpty: boolean;
}

const TextFieldContext = React.createContext<IContext | undefined>(undefined);

if (process.env.NODE_ENV !== "production") {
  TextFieldContext.displayName = "TextFieldContext";
}

export default TextFieldContext;
