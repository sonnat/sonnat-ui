import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
  /** The action to display in the header. */
  action?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
};

export type CardHeaderProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface CardHeaderFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: CardHeaderProps<P>): JSX.Element;
}

declare const CardHeader: CardHeaderFC<{}>;

export default CardHeader;
