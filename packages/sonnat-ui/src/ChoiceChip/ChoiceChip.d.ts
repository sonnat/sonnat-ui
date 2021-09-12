import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
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
    size?: "large" | "medium" | "small";
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
    /**
     * The default state of `selected`. Use when the component is not controlled.
     * @default false
     */
    defaultSelected?: boolean;
    /**
     * If `true`, the chip will be selected.
     * @default false
     */
    selected?: boolean;
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

export type ChoiceChipProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"button", BaseProps<P>>;

declare const ChoiceChip: (props: ChoiceChipProps) => JSX.Element;

export default ChoiceChip;
