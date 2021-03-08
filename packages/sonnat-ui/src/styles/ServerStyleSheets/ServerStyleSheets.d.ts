/* eslint-disable no-unused-vars */
import * as React from "react";
import { GenerateId } from "jss";
import { SonnatInitializerProps } from "../SonnatInitializer";

export interface ServerStyleSheetsOptions {
  /** The id attribute for <style> tag. */
  id?: string;
  /** JSS's class name generator. */
  generateClassName?: GenerateId;
}

declare class ServerStyleSheets {
  constructor(options?: ServerStyleSheetsOptions);

  collect(
    children: React.ReactNode,
    options?: object
  ): React.ReactElement<SonnatInitializerProps>;

  toString(): string;

  getStyleElementId(): string;

  getStyleElement(props?: object): React.ReactElement;
}

export default ServerStyleSheets;
