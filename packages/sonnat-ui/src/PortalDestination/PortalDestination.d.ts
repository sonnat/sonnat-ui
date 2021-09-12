import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /** The content of the component. */
    children?: React.ReactNode;
  };

export type PortalDestinationProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"div", BaseProps<P>>;

declare const PortalDestination: (props: PortalDestinationProps) => JSX.Element;

export default PortalDestination;
