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
    /**
     * Set the `text-align` css property of the table cell.
     * @default "inherit"
     */
    textAlign?: "inherit" | "center" | "justify" | "left" | "right";
  };

export type TableCellProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"td" | "th", BaseProps<P>>;

declare const TableCell: (props: TableCellProps) => JSX.Element;

export default TableCell;
