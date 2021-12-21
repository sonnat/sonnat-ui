import * as React from "react";

interface IContext {
  cellVariant: "body" | "header" | "footer";
}

const TableInnerContext = React.createContext<IContext | undefined>(undefined);

if (process.env.NODE_ENV !== "production")
  TableInnerContext.displayName = "TableInnerContext";

export default TableInnerContext;
