import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the container. */
  children?: React.ReactNode;
};

export type CssBaselineProps<P = {}> = BaseProps<P>;

declare const CssBaseline: (props: CssBaselineProps) => JSX.Element;

export default CssBaseline;
