import * as React from "react";
import type { MergeElementProps } from "../typings";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

type BaseProps<P = {}> = P & {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The name of the text field. */
  name?: string;
  /**
   * The text of the label in legend style.
   */
  legendLabel?: string;
  /** The `placeholder` property of the text field. */
  placeholder?: string;
  /**
   * The value of the text field. The DOM API casts this to a string.
   */
  value?: string;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: string;
  /** The helper text content. */
  helperText?: string;
  /** The helper icon element placed before the helper text. */
  helperIcon?: React.ReactNode;
  /**
   * The leading adornment for this component.
   *
   * This can be used to add a prefix, an action, or an icon to the leading of your input.
   */
  leadingAdornment?: React.ReactNode;
  /**
   * The trailing adornment for this component.
   *
   * This can be used to add a suffix, an action, or an icon to the trailing of your input.
   */
  trailingAdornment?: React.ReactNode;
  /**
   * If `true`, the text field will be rounded.
   * @default false
   */
  rounded?: boolean;
  /**
   * If `true`, the text field will be readOnly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the text field will be focused.
   * @default false
   */
  focused?: boolean;
  /**
   * If `true`, the text field will be focused on mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * If `true`, the text field will fill the entire width of the parent.
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, the text field will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the text field will be required.
   * @default false
   */
  required?: boolean;
  /**
   * If `true`, the text field will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /**
   * The size of the text field.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * The variant of the text field.
   * @default "outlined"
   */
  variant?: "filled" | "outlined";
  /**
   * The type of the input.
   * @default "text"
   */
  type?: "text" | "email" | "password";
  /** The properties applied to the `input` element. */
  inputProps?: InputProps;
  /**
   * The Callback fires when the state has changed.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * @param {string} value The current value of the text field.
   *
   * You can also pull out the current value by accessing `event.target.value` (string).
   */
  onChange?: (
    /* eslint-disable no-unused-vars */
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
    /* eslint-enable no-unused-vars */
  ) => void;
  /**
   * The Callback fires when the text field has received focus.
   *
   * @param {React.FocusEvent<HTMLInputElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * The Callback fires when the text field has lost focus.
   *
   * @param {React.FocusEvent<HTMLInputElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

export type TextFieldProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const TextField: (props: TextFieldProps) => JSX.Element;

export default TextField;
