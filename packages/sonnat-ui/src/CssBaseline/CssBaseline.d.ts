import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the container. */
  children?: React.ReactNode;
};

export type CssBaselineProps<P> = BaseProps<P>;

export interface CssBaselineFC<P> {
  // eslint-disable-next-line no-unused-vars
  (props: CssBaselineProps<P>): JSX.Element;
}

declare const CssBaseline: CssBaselineFC<{}>;

export default CssBaseline;
