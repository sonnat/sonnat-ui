import { createContext } from "react";

const TableContext = createContext({ isDense: false });

if (process.env.NODE_ENV !== "production")
  TableContext.displayName = "TableContext";

export default TableContext;
