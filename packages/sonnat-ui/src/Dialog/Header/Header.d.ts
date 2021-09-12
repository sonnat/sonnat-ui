import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /** The content of the component. */
    children?: React.ReactNode;
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /** The title to display in the header. */
    title: string;
  };

export type DialogHeaderProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"div", BaseProps<P>>;

declare const DialogHeader: (props: DialogHeaderProps) => JSX.Element;

export default DialogHeader;
