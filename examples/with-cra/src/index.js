import CssBaseline from "@sonnat/ui/CssBaseline";
import SonnatInitializer from "@sonnat/ui/styles/SonnatInitializer";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "./theme";

ReactDOM.render(
  <SonnatInitializer theme={theme}>
    <div id="main-wrapper">
      <CssBaseline />
      <App />
    </div>
  </SonnatInitializer>,
  document.getElementById("root")
);
