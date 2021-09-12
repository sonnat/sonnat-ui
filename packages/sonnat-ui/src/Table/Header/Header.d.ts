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
  };

export type TableHeaderProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"thead", BaseProps<P>>;

declare const TableHeader: (props: TableHeaderProps) => JSX.Element;

export default TableHeader;
