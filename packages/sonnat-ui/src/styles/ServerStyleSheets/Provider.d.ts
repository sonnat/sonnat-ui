/* eslint-disable no-unused-vars */
import * as React from "react";
import type { GenerateClassName, SheetsRegistry } from "../../typings";

export interface ServerContextValue {
  sheetsRegistry: SheetsRegistry;
  generateServerClassName: GenerateClassName;
}

export declare const ServerContext: React.Context<ServerContextValue>;

export interface ServerProviderProps {
  children: React.ReactNode;
  sheetsRegistry: SheetsRegistry;
  generateServerClassName: GenerateClassName;
}

export default function ServerProvider(
  props: ServerProviderProps
): React.ReactElement<ServerProviderProps>;
