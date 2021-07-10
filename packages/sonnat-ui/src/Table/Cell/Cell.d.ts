import * as React from "react";
import type { MergeElementProps } from "../../typings";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  textAlign?: "inherit" | "center" | "justify" | "left" | "right";
};

export type TableCellProps<P = {}> = MergeElementProps<
  "td" | "th",
  BaseProps<P>
>;

declare const TableCell: (props: TableCellProps) => JSX.Element;

export default TableCell;
