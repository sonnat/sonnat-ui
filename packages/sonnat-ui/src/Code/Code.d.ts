import * as React from "react";
import type { MergeElementProps } from "../typings";

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

export type CodeProps<P = {}> = MergeElementProps<"code" | "pre", BaseProps<P>>;

declare const Code: (props: CodeProps) => JSX.Element;

export default Code;
