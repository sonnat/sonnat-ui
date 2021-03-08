import * as React from "react";

type BaseProps<P = {}> = P & {
  /**
   * The content of the Card.
   *
   * The Card component only accepts `Card/Action` component as a child.
   */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
};

export type CardActionBarProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface CardActionBarFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: CardActionBarProps<P>): JSX.Element;
}

declare const CardActionBar: CardActionBarFC<{}>;

export default CardActionBar;
