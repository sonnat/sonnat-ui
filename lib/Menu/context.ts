import * as React from "react";

interface IContext {
  registerNode: (
    index: number,
    node: HTMLDivElement & { disabled?: boolean }
  ) => void;
  dense: boolean;
}

const MenuContext = React.createContext<IContext | undefined>(undefined);

if (process.env.NODE_ENV !== "production")
  MenuContext.displayName = "MenuContext";

export default MenuContext;
