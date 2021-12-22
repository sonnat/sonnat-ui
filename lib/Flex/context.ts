import * as React from "react";

interface IContext {
  isColumn: boolean;
}

const FlexContext = React.createContext<IContext>({ isColumn: false });

if (process.env.NODE_ENV !== "production")
  FlexContext.displayName = "FlexContext";

export default FlexContext;
