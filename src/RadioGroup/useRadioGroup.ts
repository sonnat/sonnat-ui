import * as React from "react";
import RadioGroupContext, { IContext } from "./context";

const useRadioGroup = (): IContext | undefined =>
  React.useContext(RadioGroupContext);

export default useRadioGroup;
