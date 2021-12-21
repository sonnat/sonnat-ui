import * as React from "react";

export interface IContext {
  value: string;
  onChange: (value?: string) => void;
}

const RadioGroupContext = React.createContext<IContext | undefined>(undefined);

if (process.env.NODE_ENV !== "production") {
  RadioGroupContext.displayName = "RadioGroupContext";
}

export default RadioGroupContext;
