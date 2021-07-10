import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}> = P & {
  /** The content of the group. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The name of the radio controls. */
  name?: string;
  /**
   * Value of the selected radio button. The DOM API casts this to a string.
   */
  value?: string;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: string;
  /**
   * The layout direction of the group.
   * @default "column"
   */
  layoutDirection?: "row" | "column";
  /**
   * The Callback fires when a radio button has selected.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * @param {string} selectedValue The value of the selected radio button.
   */
  onChange?: (
    /* eslint-disable no-unused-vars */
    event: React.ChangeEvent<HTMLInputElement>,
    selectedValue: string
    /* eslint-enable no-unused-vars */
  ) => void;
};

export type RadioGroupProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const RadioGroup: (props: RadioGroupProps) => JSX.Element;

export default RadioGroup;
