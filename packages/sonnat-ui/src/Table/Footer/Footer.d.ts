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

export type TableFooterProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"tfoot", BaseProps<P>>;

declare const TableFooter: (props: TableFooterProps) => JSX.Element;

export default TableFooter;
