import { SheetsRegistry } from "jss";
import React from "react";
import type {
  AnyObject,
  EmptyIntersectionObject,
  GenerateClassName
} from "../../typings";
import createGenerateClassName from "../createGenerateClassName";
import ServerProvider from "./Provider";

export interface ServerStyleSheetsOptions {
  /** The id attribute for <style> tag. */
  id?: string;
  /** JSS's class name generator. */
  generateClassName?: GenerateClassName;
}

export default class ServerStyleSheets {
  private _sheetsRegistry: SheetsRegistry | null = null;

  private _generateClassName: GenerateClassName;
  private _styleElementId: string;

  constructor(options: ServerStyleSheetsOptions = {}) {
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

    this._generateClassName = generateClassName;
    this._styleElementId = id;
  }

  collect(children: React.ReactNode): JSX.Element {
    // This is needed in order to inject the critical CSS.
    this._sheetsRegistry = new SheetsRegistry();

    return (
      <ServerProvider
        generateServerClassName={this._generateClassName}
        sheetsRegistry={this._sheetsRegistry}
      >
        {children}
      </ServerProvider>
    );
  }

  toString(): string {
    return this._sheetsRegistry ? this._sheetsRegistry.toString() : "";
  }

  getStyleElementId(): string {
    return this._styleElementId;
  }

  getStyleElement<P extends AnyObject = EmptyIntersectionObject>(
    props: P = {} as EmptyIntersectionObject as P
  ): React.ReactElement {
    return React.createElement("style", {
      id: this._styleElementId,
      key: this._styleElementId,
      dangerouslySetInnerHTML: { __html: this.toString() },
      ...props
    });
  }
}
