import * as React from "react";

type BaseProps<P = {}> = P & {
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

export type TableRowProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"tr">, keyof BaseProps<P>>;

export interface TableRowFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: TableRowProps<P>): JSX.Element;
}

declare const TableRow: TableRowFC<{}>;

export default TableRow;
