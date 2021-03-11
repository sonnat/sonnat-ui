import * as React from "react";

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
  /** The name of the TextArea. */
  name?: string;
  /** The `placeholder` property of the TextArea. */
  placeholder?: string;
  /**
   * The value of the TextArea. The DOM API casts this to a string.
   */
  value?: string;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: string;
  /** The helper text content. */
  helperText?: string;
  /** The helper icon. */
  helperIcon?: React.ReactNode;
  /**
   * If `true`, the TextArea will be vertically resizable.
   * @default false
   */
  resizable?: boolean;
  /**
   * If `true`, the TextArea will be readOnly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the TextArea will be focused.
   * @default false
   */
  focused?: boolean;
  /**
   * If `true`, the TextArea will be focused on mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * If `true`, the TextArea will fill the entire width of the parent.
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, the TextArea will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the TextArea will be required.
   * @default false
   */
  required?: boolean;
  /**
   * If `true`, the TextArea will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /** The properties applied to the `input` element. */
  inputProps?: InputProps;
  /**
   * The Callback fires when the state has changed.
   *
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event The event source of the callback.
   * @param {string} value The current value of the TextArea.
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
   * The Callback fires when the TextArea has received focus.
   *
   * @param {React.FocusEvent<HTMLTextAreaElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  /**
   * The Callback fires when the TextArea has lost focus.
   *
   * @param {React.FocusEvent<HTMLTextAreaElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
};
export type TextAreaProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface TextAreaFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: TextAreaProps<P>): JSX.Element;
}

declare const TextArea: TextAreaFC<{}>;

export default TextArea;
