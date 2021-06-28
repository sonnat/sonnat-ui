/* eslint-disable no-unused-vars */
import { createContext } from "react";

const DialogContext = createContext({
  id: "",
  bodyHeight: 0,
  hasOverflow: false,
  registerHeader: node => {},
  registerBody: node => {},
  registerActionBar: node => {},
  nodesMap: new Map()
});

if (process.env.NODE_ENV !== "production")
  DialogContext.displayName = "DialogContext";

export default DialogContext;
