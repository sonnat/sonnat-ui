import * as React from "react";

type BaseProps<P = {}> = P & {
  /**
   * The content of the Card.
   *
   * The Card component only accepts `Card/ActionBar` component as a child.
   */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The `src` attribute of the image. */
  img?: string;
  /** The title text of the card. */
  title?: string;
  /** The subtitle text of the card. */
  subtitle?: string;
  /** The description text of the card. */
  description?: string;
  /**
   * If `true`, the card will be horizontal.
   * @default false
   */
  horizontal?: boolean;
  /**
   * If `true`, the card will be outlined.
   * @default false
   */
  outlined?: boolean;
  /**
   * If `true`, the card's image will be fluid and cover up the card.
   * @default false
   */
  imageCovered?: boolean;
};

export type CardProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"article">, keyof BaseProps<P>>;

export interface CardFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: CardProps<P>): JSX.Element;
}

declare const Card: CardFC<{}>;

export default Card;
