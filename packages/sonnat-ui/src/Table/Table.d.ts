import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /** The content of the component. */
    children?: React.ReactNode;
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /** Set the content of the `<caption>` element. */
    caption?: string;
    /** The properties applied to the `table` element. */
    htmlTableProps?: React.ComponentPropsWithoutRef<"table">;
    /**
     * If `true`, the table will appear denser.
     * @default false
     */
    dense?: boolean;
    /**
     * If `true`, the table will be border-less.
     * @default false
     */
    borderLess?: boolean;
  };

export type TableProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"div", BaseProps<P>>;

declare const Table: (props: TableProps) => JSX.Element;

export default Table;
