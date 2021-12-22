import * as React from "react";

export interface IContext {
  value: string[];
  onChange: (isChecked: boolean, value?: string) => void;
}

const CheckGroupContext = React.createContext<IContext | undefined>(undefined);

if (process.env.NODE_ENV !== "production") {
  CheckGroupContext.displayName = "CheckGroupContext";
}

export default CheckGroupContext;
