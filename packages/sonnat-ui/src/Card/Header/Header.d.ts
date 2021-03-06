import * as React from "react";
import type { MergeElementProps } from "../../typings";

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

export type CardHeaderProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const CardHeader: (props: CardHeaderProps) => JSX.Element;

export default CardHeader;
