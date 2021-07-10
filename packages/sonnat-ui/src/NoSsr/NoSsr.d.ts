import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the component. (in CSR) */
  children?: React.ReactNode;
  /** The content of the component. (in SSR) */
  fallback?: React.ReactNode;
};

export type NoSsrProps<P = {}> = BaseProps<P>;

declare const NoSsr: (props: NoSsrProps) => JSX.Element;

export default NoSsr;
