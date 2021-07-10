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
  /** The title to display in the header. */
  title: string;
};

export type DialogHeaderProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const DialogHeader: (props: DialogHeaderProps) => JSX.Element;

export default DialogHeader;
