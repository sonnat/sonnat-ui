import * as React from "react";

export interface IContext {
  fluid: boolean;
  disabled: boolean;
  hasError: boolean;
  required: boolean;
  focusedState: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

const FormControlContext = React.createContext<IContext | undefined>(undefined);

if (process.env.NODE_ENV !== "production") {
  FormControlContext.displayName = "FormControlContext";
}

export default FormControlContext;
