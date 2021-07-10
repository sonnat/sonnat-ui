import * as React from "react";
import type { MergeElementProps } from "../typings";

export type BaseProps<P = {}, T extends React.ElementType> = {
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  rootNode?: T;
  /** The content of the button. */
  label?: string;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the button will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The size of the button when it only has a `leadingIcon`.
   * @default "medium"
   */
  iconButtonSize?: "small" | "medium" | "large";
  /**
   * The leading icon element placed before the label.
   */
  leadingIcon?: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export type FloatingActionButtonProps<
  P = {},
  T extends React.ElementType = "button"
> = MergeElementProps<T, BaseProps<P, T>>;

declare const FloatingActionButton: (
  props: FloatingActionButtonProps
) => JSX.Element;

export default FloatingActionButton;
