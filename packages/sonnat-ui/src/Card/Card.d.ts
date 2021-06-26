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

export type CardProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface CardFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: CardProps<P>): JSX.Element;
}

declare const Card: CardFC<{}>;

export default Card;
