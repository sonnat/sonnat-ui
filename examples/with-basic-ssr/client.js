import CssBaseline from "@sonnat/ui/CssBaseline";
import SonnatInitializer from "@sonnat/ui/styles/SonnatInitializer";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "./theme";

const Main = () => {
  return (
    <SonnatInitializer theme={theme}>
      <CssBaseline />
      <App />
    </SonnatInitializer>
  );
};

ReactDOM.hydrate(<Main />, document.getElementById("root"));
