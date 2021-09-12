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

export type TableBodyProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"tbody", BaseProps<P>>;

declare const TableBody: (props: TableBodyProps) => JSX.Element;

export default TableBody;
