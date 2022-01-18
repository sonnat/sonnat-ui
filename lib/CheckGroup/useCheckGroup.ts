import * as React from "react";
import CheckGroupContext, { IContext } from "./context";

const useCheckGroup = (): IContext | undefined =>
  React.useContext(CheckGroupContext);

export default useCheckGroup;
