import * as React from "react";
import type { MergeElementProps } from "../../typings";

type BaseProps<P = {}> = P & {
  /** The content of the group. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Append to the classNames applied to the title so you can override or
   * extend the styles.
   */
  titleClassName?: string;
  /** The title of the group. */
  title?: string;
};

export type MenuItemGroupProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const MenuItemGroup: (props: MenuItemGroupProps) => JSX.Element;

export default MenuItemGroup;
