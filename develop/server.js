import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import CssBaseline from "@sonnat/ui/dist/CssBaseline";
import ServerStyleSheets from "@sonnat/ui/dist/styles/ServerStyleSheets";
import SonnatInitializer from "@sonnat/ui/dist/styles/SonnatInitializer";
import App from "./App";
import theme from "./theme";

let prefixer;
let cleanCSS;

if (process.env.NODE_ENV === "production") {
  const postcss = require("postcss");
  const autoprefixer = require("autoprefixer");
  const CleanCSS = require("clean-css");

  prefixer = postcss([autoprefixer]);
  cleanCSS = new CleanCSS();
}

function renderFullPage(html, css, styleElementId) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Sonnat Dev</title>
      <style id="${styleElementId}">${css}</style>
      <link rel="stylesheet" href="build/main.css"/>
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
    </head>
    <body>
      <div id="root">${html}</div>
      <script async src="build/bundle.js"></script>
    </body>
  </html>
  `;
}

async function handleRender(req, res) {
  const sheets = new ServerStyleSheets();

  // Render the component to a string.
  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <SonnatInitializer theme={theme}>
        <CssBaseline />
        <App />
      </SonnatInitializer>
    )
  );

  // Grab the CSS from our sheets.
  const css = sheets.toString();

  // Prefix and minify the grabbed CSS.
  const minifiedCSS = await (async rawCSS => {
    // It might be undefined, e.g. after an error.
    if (rawCSS && process.env.NODE_ENV === "production") {
      const { css: prefixedCSS } = await prefixer.process(rawCSS, {
        from: undefined
      });
      return cleanCSS.minify(prefixedCSS).styles;
    } else return rawCSS;
  })(css);

  // Send the rendered page back to the client.
  res.send(renderFullPage(html, minifiedCSS, sheets.getStyleElementId()));
}

const app = express();

app.use("/build", express.static("build"));

// This is fired every time the server-side receives a request.
app.use(handleRender);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log(
    [
      `Server is successfully running as ${process.env.NODE_ENV}.`,
      `You can now view it in the browser at http://localhost:3000`
    ].join("\n")
  );
});
