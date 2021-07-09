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

export type TableFooterProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"tfoot">, keyof BaseProps<P>>;

export interface TableFooterFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: TableFooterProps<P>): JSX.Element;
}

declare const TableFooter: TableFooterFC<{}>;

export default TableFooter;
