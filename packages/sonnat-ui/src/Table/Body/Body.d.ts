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

export type TableBodyProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"tbody">, keyof BaseProps<P>>;

export interface TableBodyFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: TableBodyProps<P>): JSX.Element;
}

declare const TableBody: TableBodyFC<{}>;

export default TableBody;
