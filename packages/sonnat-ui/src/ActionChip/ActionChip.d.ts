import * as React from "react";

type BaseProps<P = {}> = P & {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The text of the chip. */
  label?: string;
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

export type ActionChipProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"button">, keyof BaseProps<P>>;

export interface ActionChipFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: ActionChipProps<P>): JSX.Element;
}

declare const ActionChip: ActionChipFC<{}>;

export default ActionChip;
