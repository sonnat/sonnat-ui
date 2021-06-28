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

export type DialogActionBarProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface DialogActionBarFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: DialogActionBarProps<P>): JSX.Element;
}

declare const DialogActionBar: DialogActionBarFC<{}>;

export default DialogActionBar;
