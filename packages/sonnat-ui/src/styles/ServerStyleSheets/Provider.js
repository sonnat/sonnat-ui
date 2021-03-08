import React from "react";
import PropTypes from "prop-types";
import { SheetsRegistry } from "jss";

export const ServerContext = React.createContext({
  sheetsRegistry: null,
  generateServerClassName: null
});

if (process.env.NODE_ENV !== "production") {
  ServerContext.displayName = "ServerContext";
}

export default function ServerProvider(props) {
  const { children, sheetsRegistry, generateServerClassName } = props;

  return (
    <ServerContext.Provider value={{ sheetsRegistry, generateServerClassName }}>
      {children}
    </ServerContext.Provider>
  );
}

ServerProvider.propTypes = {
  children: PropTypes.node.isRequired,
  sheetsRegistry: PropTypes.instanceOf(SheetsRegistry),
  generateServerClassName: PropTypes.func
};
