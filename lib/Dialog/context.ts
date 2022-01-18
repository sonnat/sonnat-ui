import * as React from "react";

interface IContext {
  id?: string;
  bodyHeight: number;
  hasOverflow: boolean;
  registerHeader: (node: HTMLDivElement) => void;
  registerBody: (node: HTMLDivElement) => void;
  registerActionBar: (node: HTMLDivElement) => void;
  nodesMap: Map<string, HTMLDivElement>;
}

const DialogContext = React.createContext<IContext | undefined>(undefined);

if (process.env.NODE_ENV !== "production")
  DialogContext.displayName = "DialogContext";

export default DialogContext;
