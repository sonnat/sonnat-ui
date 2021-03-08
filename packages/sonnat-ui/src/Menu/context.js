import { createContext } from "react";

const MenuContext = createContext({
  // eslint-disable-next-line no-unused-vars
  registerNode: node => {},
  dense: false
});

if (process.env.NODE_ENV !== "production")
  MenuContext.displayName = "MenuContext";

export default MenuContext;
