import * as React from "react";

interface IContext {
  isDense: boolean;
}

const TableContext = React.createContext<IContext | undefined>(undefined);

if (process.env.NODE_ENV !== "production")
  TableContext.displayName = "TableContext";

export default TableContext;
