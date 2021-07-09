import { createContext } from "react";

const TableRowContext = createContext({ isSelected: false });

if (process.env.NODE_ENV !== "production")
  TableRowContext.displayName = "TableRowContext";

export default TableRowContext;
