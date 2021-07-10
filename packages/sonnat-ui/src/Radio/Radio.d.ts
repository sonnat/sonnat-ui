import * as React from "react";
import type { MergeElementProps } from "../typings";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  ref?: React.Ref<HTMLLabelElement>;
}

type BaseProps<P = {}> = P & {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `label` text provided, a `<label>` will be rendered next to the radio.
   */
  label?: string;
  /** The name of the radio. */
  name?: string;
  /**
   * The value of the radio. The DOM API casts this to a string.
   * The browser uses "on" as the default value.
   */
  value?: string;
  /**
   * If `true`, the radio will be readOnly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the radio will be checked.
   */
  checked?: boolean;
  /**
   * The default state of `checked`. Use when the component is not controlled.
   */
  defaultChecked?: boolean;
  /**
   * If `true`, the radio will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the radio will be required.
   * @default false
   */
  required?: boolean;
  /**
   * If `true`, the radio will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /**
   * The Callback fires when the state has changed.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * @param {boolean} checkedState The new checked state.
   *
   * You can also pull out the new checked state by accessing `event.target.checked` (boolean).
   */
  onChange?: (
    /* eslint-disable no-unused-vars */
    event: React.ChangeEvent<HTMLInputElement>,
    checkedState: boolean
    /* eslint-enable no-unused-vars */
  ) => void;
  /**
   * The Callback fires when the radio has received focus.
   *
   * @param {React.FocusEvent<HTMLInputElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * The Callback fires when the radio has lost focus.
   *
   * @param {React.FocusEvent<HTMLInputElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** The properties applied to the `input` element. */
  inputProps?: InputProps;
  /** The properties applied to the `label` element. */
  labelProps?: LabelProps;
};

export type RadioProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const Radio: (props: RadioProps) => JSX.Element;

export default Radio;
