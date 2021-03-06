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
   * The variant of the component.
   * @default "node"
   */
  variant?: "node" | "icon" | "text";
};

export type InputAdornmentProps<P = {}> = MergeElementProps<
  "div",
  BaseProps<P>
>;

declare const InputAdornment: (props: InputAdornmentProps) => JSX.Element;

export default InputAdornment;
