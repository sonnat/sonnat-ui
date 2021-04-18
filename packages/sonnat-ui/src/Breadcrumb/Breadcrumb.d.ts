import * as React from "react";

type BaseProps<P = {}> = P & {
  /**
   * The content of the breadcrumb.
   *
   * The breadcrumb component only accepts `Breadcrumb/Item` component as a child.
   */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the breadcrumb will only show the previous step.
   *
   * It's useful when rendering on mobile devices.
   * @default false
   */
  showOnlyPreviousStep?: boolean;
};

export type BreadcrumbProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"nav">, keyof BaseProps<P>>;

export interface BreadcrumbFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: BreadcrumbProps<P>): JSX.Element;
}

declare const Breadcrumb: BreadcrumbFC<{}>;

export default Breadcrumb;
