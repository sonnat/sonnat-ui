import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}> = P & {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The value of the `top` CSSProperty.
   * It will indicate the component's distance from top.
   */
  top?: number | string;
  /**
   * If `true`, the component will indicate the loading progress.
   * @default false
   */
  loading?: boolean;
};

export type PageLoaderProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const PageLoader: (props: PageLoaderProps) => JSX.Element;

export default PageLoader;
