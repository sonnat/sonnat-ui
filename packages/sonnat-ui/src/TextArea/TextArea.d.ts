import * as React from "react";
import type { MergeElementProps } from "../typings";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  ref?: React.Ref<HTMLTextAreaElement>;
}

type BaseProps<P = {}> = P & {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The name of the textarea. */
  name?: string;
  /** The `placeholder` property of the textarea. */
  placeholder?: string;
  /**
   * The value of the textarea. The DOM API casts this to a string.
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
   * Maximum number of rows to display.
   */
  maxRows?: string | number;
  /**
   * Minimum number of rows to display.
   */
  minRows?: string | number;
  /**
   * If `true`, the textarea will automatically adjust the height.
   * @default false
   */
  autoResize?: boolean;
  /**
   * If `true`, the textarea will be vertically resizable.
   * @default false
   */
  resizable?: boolean;
  /**
   * If `true`, the textarea will be readOnly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the textarea will be focused.
   * @default false
   */
  focused?: boolean;
  /**
   * If `true`, the textarea will be focused on mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * If `true`, the textarea will fill the entire width of the parent.
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, the textarea will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the textarea will be required.
   * @default false
   */
  required?: boolean;
  /**
   * If `true`, the textarea will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /** The properties applied to the `input` element. */
  inputProps?: InputProps;
  /**
   * The Callback fires when the state has changed.
   *
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event The event source of the callback.
   * @param {string} value The current value of the textarea.
   *
   * You can also pull out the current value by accessing `event.target.value` (string).
   */
  onChange?: (
    /* eslint-disable no-unused-vars */
    event: React.ChangeEvent<HTMLTextAreaElement>,
    value: string
    /* eslint-enable no-unused-vars */
  ) => void;
  /**
   * The Callback fires when the textarea has received focus.
   *
   * @param {React.FocusEvent<HTMLTextAreaElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  /**
   * The Callback fires when the textarea has lost focus.
   *
   * @param {React.FocusEvent<HTMLTextAreaElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
};

export type TextAreaProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const TextArea: (props: TextAreaProps) => JSX.Element;

export default TextArea;
