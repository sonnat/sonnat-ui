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

export type TableHeaderProps<P = {}> = MergeElementProps<"thead", BaseProps<P>>;

declare const TableHeader: (props: TableHeaderProps) => JSX.Element;

export default TableHeader;
