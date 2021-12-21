import * as React from "react";

interface IContext {
  size: "large" | "medium" | "small";
  disabled: boolean;
  hasError: boolean;
}

const InputBaseContext = React.createContext<IContext | undefined>(undefined);

if (process.env.NODE_ENV !== "production") {
  InputBaseContext.displayName = "InputBaseContext";
}

export default InputBaseContext;
