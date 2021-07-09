import * as React from "react";

type BaseProps<P = {}> = P & {
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
};

export type TableProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface TableFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: TableProps<P>): JSX.Element;
}

declare const Table: TableFC<{}>;

export default Table;
