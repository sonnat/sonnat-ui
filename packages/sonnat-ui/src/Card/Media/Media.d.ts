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
};

export type CardMediaProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const CardMedia: (props: CardMediaProps) => JSX.Element;

export default CardMedia;
