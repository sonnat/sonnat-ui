import { createContext } from "react";

const FormControlContext = createContext();

if (process.env.NODE_ENV !== "production") {
  FormControlContext.displayName = "FormControlContext";
}

export default FormControlContext;
