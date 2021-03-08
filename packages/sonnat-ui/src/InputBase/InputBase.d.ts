import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the component */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The text of the label in legend style.
   */
  legendLabel?: string;
  /**
   * Leading adornment for this component.
   *
   * This can be used to add a prefix, a suffix or an action to the leading of your input.
   */
  leadingAdornment: React.ReactNode;
  /**
   * Leading adornment for this component.
   *
   * This can be used to add a prefix, a suffix or an action to the trailing of your input.
   */
  trailingAdornment: React.ReactNode;
  /**
   * If `true`, the component will be rounded.
   * @default false
   */
  rounded?: boolean;
  /**
   * If `true`, the component will be readOnly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the component will be focused.
   * @default false
   */
  focused?: boolean;
  /**
   * If `true`, the component will fill the entire width of the parent.
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, the component will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the component will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /**
   * The size of the component.
   * @default "medium"
   */
  size?: "medium" | "small";
  /**
   * The variant of the component.
   * @default "outlined"
   */
  variant?: "filled" | "outlined";
};
export type InputBaseProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface InputBaseFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: InputBaseProps<P>): JSX.Element;
}

declare const InputBase: InputBaseFC<{}>;

export default InputBase;
