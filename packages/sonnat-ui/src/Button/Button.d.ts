import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}, T extends React.ElementType = "button"> = P & {
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  rootNode?: T;
  /**
   * The content of the button.
   */
  label?: string;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the button will be rounded.
   * @default false
   */
  rounded?: boolean;
  /**
   * If `true`, the button will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the button will have elavation.
   *
   * Note: You can only use the `raised={true}` property on `filled` buttons.`
   * @default false
   */
  raised?: boolean;
  /**
   * If `true`, the button will have a loading indicator.
   * @default false
   */
  loading?: boolean;
  /**
   * The size of the button.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * The color of the button.
   * @default "default"
   */
  color?: "default" | "primary" | "secondary";
  /**
   * The variant of the button.
   * @default "filled"
   */
  variant?: "filled" | "outlined" | "inlined";
  /**
   * The leading icon element placed before the label.
   */
  leadingIcon?: React.ReactNode;
  /**
   * The trailing icon element placed before the label.
   */
  trailingIcon?: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export type ButtonProps<
  P = {},
  T extends React.ElementType = "button"
> = MergeElementProps<T, BaseProps<P, T>>;

declare const Button: <T extends React.ElementType = "button">(
  props: ButtonProps<{}, T>
) => JSX.Element;

export default Button;
