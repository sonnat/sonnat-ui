import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the form controller will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the form controller will be required.
   * @default false
   */
  required?: boolean;
  /**
   * If `true`, the form controller will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /**
   * If `true`, the form controller will be fluid (max-width: 100%).
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, the form controller will be focused.
   * @default false
   */
  focused?: boolean;
  /**
   * The size of the form controller.
   * @default "medium"
   */
  size?: "small" | "medium";
};

export type FormControlProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const FormControl: (props: FormControlProps) => JSX.Element;

export default FormControl;
