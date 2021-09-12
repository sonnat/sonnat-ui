import * as React from "react";
import type { EmptyIntersectionObject } from "../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /** The content of the component. (in CSR) */
    children?: React.ReactNode;
    /** The content of the component. (in SSR) */
    fallback?: React.ReactNode;
  };

export type NoSsrProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = BaseProps<P>;

declare const NoSsr: (props: NoSsrProps) => JSX.Element;

export default NoSsr;
