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
};

export type TableBodyProps<P = {}> = MergeElementProps<"tbody", BaseProps<P>>;

declare const TableBody: (props: TableBodyProps) => JSX.Element;

export default TableBody;
