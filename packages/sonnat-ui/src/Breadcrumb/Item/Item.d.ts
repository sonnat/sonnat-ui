import * as React from "react";

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

export type BreadcrumbItemProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"li">, keyof BaseProps<P>>;

export interface BreadcrumbItemFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: BreadcrumbItemProps<P>): JSX.Element;
}

declare const BreadcrumbItem: BreadcrumbItemFC<{}>;

export default BreadcrumbItem;
