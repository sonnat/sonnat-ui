import * as React from "react";
import FormControlContext, { IContext } from "./context";

const useFormControl = (): IContext | undefined =>
  React.useContext(FormControlContext);

export default useFormControl;
