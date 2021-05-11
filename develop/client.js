import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@sonnat/ui/dist/CssBaseline";
import ThemeProvider from "@sonnat/ui/dist/styles/ThemeProvider";
import SonnatInitializer from "@sonnat/ui/dist/styles/SonnatInitializer";
import useDarkMode from "@sonnat/ui/dist/styles/useDarkMode";
import App from "./App";
import theme from "./theme";
import GlobalContext from "./GlobalContext";

import "./static/fonts.css";

const Main = () => {
  const [isDarkMode, setDarkMode] = React.useState(false);

  const newTheme = useDarkMode(isDarkMode, theme);

  return (
    <SonnatInitializer theme={newTheme}>
      <GlobalContext.Provider value={{ isDarkMode, setDarkMode }}>
        <CssBaseline />
        <App />
      </GlobalContext.Provider>
    </SonnatInitializer>
  );
};

ReactDOM.hydrate(<Main />, document.getElementById("root"));
