import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
};

export type PortalDestinationProps<P = {}> = MergeElementProps<
  "div",
  BaseProps<P>
>;

declare const PortalDestination: (props: PortalDestinationProps) => JSX.Element;

export default PortalDestination;
