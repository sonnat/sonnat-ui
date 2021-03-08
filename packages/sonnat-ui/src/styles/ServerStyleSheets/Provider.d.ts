/* eslint-disable no-unused-vars */
import * as React from "react";
import { SheetsRegistry, GenerateId } from "jss";

export interface ServerContextValue {
  sheetsRegistry: SheetsRegistry;
  generateServerClassName: GenerateId;
}

export declare const ServerContext: React.Context<ServerContextValue>;

export interface ServerProviderProps {
  children: React.ReactNode;
  sheetsRegistry: SheetsRegistry;
  generateServerClassName: GenerateId;
}

export default function ServerProvider(
  props: ServerProviderProps
): React.ReactElement<ServerProviderProps>;
