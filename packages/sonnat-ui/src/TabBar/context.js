import { createContext } from "react";

const TabBarContext = createContext({
  dense: false,
  fluid: false,
  scrollable: false,
  onChange: () => {}
});

if (process.env.NODE_ENV !== "production") {
  TabBarContext.displayName = "TabBarContext";
}

export default TabBarContext;
