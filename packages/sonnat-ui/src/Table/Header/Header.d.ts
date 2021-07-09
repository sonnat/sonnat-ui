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

export type TableHeaderProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"thead">, keyof BaseProps<P>>;

export interface TableHeaderFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: TableHeaderProps<P>): JSX.Element;
}

declare const TableHeader: TableHeaderFC<{}>;

export default TableHeader;
