import * as React from "react";
import type { MergeElementProps } from "../../typings";

type BaseProps<P = {}> = P & {
  /**
   * The content of the breadcrumb item.
   */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
};

export type BreadcrumbItemProps<P = {}> = MergeElementProps<"li", BaseProps<P>>;

declare const BreadcrumbItem: (props: BreadcrumbItemProps) => JSX.Element;

export default BreadcrumbItem;
