import { createContext } from "react";

const GlobalContext = createContext({
  isDarkMode: false,
  setDarkMode: (isDarkMode = false) => {}
});

if (process.env.NODE_ENV !== "production") {
  GlobalContext.displayName = "GlobalContext";
}

export default GlobalContext;
