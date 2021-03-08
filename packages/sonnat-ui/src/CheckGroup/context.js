import { createContext } from "react";

const CheckGroupContext = createContext();

if (process.env.NODE_ENV !== "production") {
  CheckGroupContext.displayName = "CheckGroupContext";
}

export default CheckGroupContext;
