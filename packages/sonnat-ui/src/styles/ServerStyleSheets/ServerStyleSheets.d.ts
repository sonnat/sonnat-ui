/* eslint-disable no-unused-vars */
import * as React from "react";
import type { GenerateClassName } from "../../typings";
import type { SonnatInitializerProps } from "../SonnatInitializer";

export interface ServerStyleSheetsOptions {
  /** The id attribute for <style> tag. */
  id?: string;
  /** JSS's class name generator. */
  generateClassName?: GenerateClassName;
}

declare class ServerStyleSheets {
  constructor(options?: ServerStyleSheetsOptions);

  collect(
    children: React.ReactNode
  ): React.ReactElement<SonnatInitializerProps>;

  toString(): string;

  getStyleElementId(): string;

  getStyleElement(props?: object): React.ReactElement;
}

export default ServerStyleSheets;
