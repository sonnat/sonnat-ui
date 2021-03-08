import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
};

export type PortalDestinationProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface PortalDestinationFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: PortalDestinationProps<P>): JSX.Element;
}

declare const PortalDestination: PortalDestinationFC<{}>;

export default PortalDestination;
