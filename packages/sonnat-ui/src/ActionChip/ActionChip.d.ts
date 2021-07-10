import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}> = P & {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The text of the chip. */
  label: string;
  /**
   * The leading icon element placed before the label.
   */
  leadingIcon?: React.ReactNode;
  /**
   * The size of the chip.
   * @default "medium"
   */
  size?: "small" | "medium";
  /**
   * The color of the chip.
   * @default "default"
   */
  color?: "default" | "primary" | "secondary";
  /**
   * The variant of the chip.
   * @default "filled"
   */
  variant?: "filled" | "outlined";
  /**
   * If `true`, the chip will be rounded.
   * @default false
   */
  rounded?: boolean;
  /**
   * If `true`, the chip will be disabled.
   * @default false
   */
  disabled?: boolean;
};

export type ActionChipProps<P = {}> = MergeElementProps<"button", BaseProps<P>>;

declare const ActionChip: (props: ActionChipProps) => JSX.Element;

export default ActionChip;
