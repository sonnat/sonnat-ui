import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the component. (in CSR) */
  children?: React.ReactNode;
  /** The content of the component. (in SSR) */
  fallback?: React.ReactNode;
};

export type NoSsrProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface NoSsrFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: NoSsrProps<P>): JSX.Element;
}

declare const NoSsr: NoSsrFC<{}>;

export default NoSsr;
