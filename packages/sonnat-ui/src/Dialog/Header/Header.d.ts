import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The title to display in the header. */
  title: string;
};

export type DialogHeaderProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface DialogHeaderFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: DialogHeaderProps<P>): JSX.Element;
}

declare const DialogHeader: DialogHeaderFC<{}>;

export default DialogHeader;
