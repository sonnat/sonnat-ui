import { createContext } from "react";

const TableInnerContext = createContext({
  cellVariant: "body"
});

if (process.env.NODE_ENV !== "production")
  TableInnerContext.displayName = "TableInnerContext";

export default TableInnerContext;
