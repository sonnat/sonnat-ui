import * as React from "react";

interface IContext {
  fluid: boolean;
  scrollable: boolean;
  isRtl: boolean;
  size: "large" | "medium" | "small";
  focusLeftAdjacentTab: (identifier: number | string) => void;
  focusRightAdjacentTab: (identifier: number | string) => void;
  onChange: (identifier: number | string) => void;
}

const TabBarContext = React.createContext<IContext | undefined>(undefined);

if (process.env.NODE_ENV !== "production") {
  TabBarContext.displayName = "TabBarContext";
}

export default TabBarContext;
