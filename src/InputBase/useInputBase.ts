import * as React from "react";
import InputBaseContext, { IContext } from "./context";

const useInputBase = (): IContext | undefined =>
  React.useContext(InputBaseContext);

export default useInputBase;
