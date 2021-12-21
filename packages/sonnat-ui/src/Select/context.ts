import * as React from "react";

interface IContext {
  isMultiple: boolean;
}

const SelectContext = React.createContext<IContext | undefined>(undefined);

if (process.env.NODE_ENV !== "production")
  SelectContext.displayName = "SelectContext";

export default SelectContext;
