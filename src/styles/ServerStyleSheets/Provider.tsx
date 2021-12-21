import { SheetsRegistry } from "jss";
import PropTypes from "prop-types";
import React from "react";
import type { GenerateClassName } from "../../typings";

interface ServerContextValue {
  sheetsRegistry: SheetsRegistry | undefined;
  generateServerClassName: GenerateClassName | undefined;
}

interface ServerProviderProps {
  children: React.ReactNode;
  sheetsRegistry?: SheetsRegistry;
  generateServerClassName?: GenerateClassName;
}

export const ServerContext = React.createContext<ServerContextValue>({
  sheetsRegistry: undefined,
  generateServerClassName: undefined
});

if (process.env.NODE_ENV !== "production") {
  ServerContext.displayName = "ServerContext";
}

const ServerProvider = (props: ServerProviderProps): JSX.Element => {
  const { children, sheetsRegistry, generateServerClassName } = props;

  return (
    <ServerContext.Provider value={{ sheetsRegistry, generateServerClassName }}>
      {children}
    </ServerContext.Provider>
  );
};

ServerProvider.propTypes = {
  children: PropTypes.node.isRequired,
  sheetsRegistry: PropTypes.instanceOf(SheetsRegistry),
  generateServerClassName: PropTypes.func
};

export default ServerProvider;
