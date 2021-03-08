import * as React from "react";

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

export type PageLoaderProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface PageLoaderFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: PageLoaderProps<P>): JSX.Element;
}

declare const PageLoader: PageLoaderFC<{}>;

export default PageLoader;
