import * as React from "react";
import type { EmptyIntersectionObject } from "../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /** The content of the container. */
    children?: React.ReactNode;
  };

export type CssBaselineProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = BaseProps<P>;

declare const CssBaseline: (props: CssBaselineProps) => JSX.Element;

export default CssBaseline;
