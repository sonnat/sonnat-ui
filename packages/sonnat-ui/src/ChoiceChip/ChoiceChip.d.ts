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
   * The leading icon placed before the label.
   * When a string was provided, the component will use it as a `sonnat-icon` identifier.
   */
  leadingIcon?: React.ReactNode;
  /**
   * The size of the chip.
   * @default "medium"
   */
  size?: "small" | "medium";
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
   * The default state of `checked`. Use when the component is not controlled.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The Callback fires when the chip has selected/deselected.
   *
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event The event source of the callback.
   * @param {boolean} isSelected Whether the chip is selected or not.
   */
  onToggle?: (
    /* eslint-disable no-unused-vars */
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    isSelected: boolean
    /* eslint-enable no-unused-vars */
  ) => void;
};

export type ChoiceChipProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"button">, keyof BaseProps<P>>;

export interface ChoiceChipFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: ChoiceChipProps<P>): JSX.Element;
}

declare const ChoiceChip: ChoiceChipFC<{}>;

export default ChoiceChip;
