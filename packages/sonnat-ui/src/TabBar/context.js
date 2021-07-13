import { createContext } from "react";

const TabBarContext = createContext({
  fluid: false,
  scrollable: false,
  size: "medium",
  onChange: () => {}
});

if (process.env.NODE_ENV !== "production") {
  TabBarContext.displayName = "TabBarContext";
}

export default TabBarContext;
