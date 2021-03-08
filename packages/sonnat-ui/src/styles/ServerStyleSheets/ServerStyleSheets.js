import React from "react";
import { SheetsRegistry } from "react-jss";
import createGenerateClassName from "../createGenerateClassName";
import ServerProvider from "./Provider";

export default class ServerStyleSheets {
  constructor(options = {}) {
    if (typeof window !== "undefined") {
      throw new Error(
        "[Sonnat]: You have to use the `ServerStyleSheets` API only when rendering on the server."
      );
    }

    const {
      id = "sonnat-jss-ssr",
      // A new class name generator
      generateClassName = createGenerateClassName()
    } = options;

    this.sheetsRegistry = null;
    this.generateClassName = generateClassName;
    this.styleElementId = id;
  }

  collect(children) {
    // This is needed in order to inject the critical CSS.
    this.sheetsRegistry = new SheetsRegistry();

    return (
      <ServerProvider
        generateServerClassName={this.generateClassName}
        sheetsRegistry={this.sheetsRegistry}
      >
        {children}
      </ServerProvider>
    );
  }

  toString() {
    return this.sheetsRegistry ? this.sheetsRegistry.toString() : "";
  }

  getStyleElementId() {
    return this.styleElementId;
  }

  getStyleElement(props) {
    return React.createElement("style", {
      id: this.styleElementId,
      key: this.styleElementId,
      dangerouslySetInnerHTML: { __html: this.toString() },
      ...props
    });
  }
}
