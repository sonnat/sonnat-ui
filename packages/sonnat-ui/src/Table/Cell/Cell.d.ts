import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
};

export type TableCellProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"td" | "th">, keyof BaseProps<P>>;

export interface TableCellFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: TableCellProps<P>): JSX.Element;
}

declare const TableCell: TableCellFC<{}>;

export default TableCell;
