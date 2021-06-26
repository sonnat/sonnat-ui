import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** Callback fired when the area is clicked. */
  // eslint-disable-next-line no-unused-vars
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export type CardActionableAreaProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface CardActionableAreaFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: CardActionableAreaProps<P>): JSX.Element;
}

declare const CardActionableArea: CardActionableAreaFC<{}>;

export default CardActionableArea;
