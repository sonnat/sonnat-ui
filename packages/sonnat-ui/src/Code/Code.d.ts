import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Determine whether the component is code-block or not.
   *
   * If `true`, the component will be rendered as a `<pre>` element.
   * otherwise, the component will be rendered as a `<code>` element.
   * @default false
   */
  codeBlock?: boolean;
};

export type CodeProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"code" | "pre">, keyof BaseProps<P>>;

export interface CodeFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: CodeProps<P>): JSX.Element;
}

declare const Code: CodeFC<{}>;

export default Code;
