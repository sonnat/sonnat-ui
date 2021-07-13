import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}> = P & {
  /** The content of the component */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The text of the label in legend style.
   */
  legendLabel?: string;
  /**
   * Leading adornment for this component.
   *
   * This can be used to add a prefix, a suffix or an action to the leading of your input.
   */
  leadingAdornment: React.ReactNode;
  /**
   * Leading adornment for this component.
   *
   * This can be used to add a prefix, a suffix or an action to the trailing of your input.
   */
  trailingAdornment: React.ReactNode;
  /**
   * If `true`, the component will be rounded.
   * @default false
   */
  rounded?: boolean;
  /**
   * If `true`, the component will be readOnly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the component will be focused.
   * @default false
   */
  focused?: boolean;
  /**
   * If `true`, the component will fill the entire width of the parent.
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, the component will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the component will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /**
   * The size of the component.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * The variant of the component.
   * @default "outlined"
   */
  variant?: "filled" | "outlined";
};

export type InputBaseProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const InputBase: (props: InputBaseProps) => JSX.Element;

export default InputBase;
