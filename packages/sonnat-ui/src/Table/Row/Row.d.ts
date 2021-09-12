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
     * The `vertical-align` property of the table row.
     * @default "middle"
     */
    verticalAlign?: "top" | "middle" | "bottom";
    /**
     * If `true`, the table row will have the selected styles.
     * @default false
     */
    selected?: boolean;
    /**
     * If `true`, the table row will have the hover styles on mouse-hovers.
     * @default false
     */
    hoverable?: boolean;
  };

export type TableRowProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"tr", BaseProps<P>>;

declare const TableRow: (props: TableRowProps) => JSX.Element;

export default TableRow;
