import * as React from "react";
import type { MergeElementProps } from "../../typings";

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

export type CardActionableAreaProps<P = {}> = MergeElementProps<
  "div",
  BaseProps<P>
>;

declare const CardActionableArea: (
  props: CardActionableAreaProps
) => JSX.Element;

export default CardActionableArea;
