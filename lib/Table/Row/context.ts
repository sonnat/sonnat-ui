import * as React from "react";

interface IContext {
  isSelected: boolean;
}

const TableRowContext = React.createContext<IContext | undefined>(undefined);

if (process.env.NODE_ENV !== "production")
  TableRowContext.displayName = "TableRowContext";

export default TableRowContext;
