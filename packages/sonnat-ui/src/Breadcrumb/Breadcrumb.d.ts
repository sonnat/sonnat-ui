import * as React from "react";
import type { MergeElementProps } from "../typings";

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

export type BreadcrumbProps<P = {}> = MergeElementProps<"nav", BaseProps<P>>;

declare const Breadcrumb: (props: BreadcrumbProps) => JSX.Element;

export default Breadcrumb;
