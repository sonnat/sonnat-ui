import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the label will appear as disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the label will indicate required input.
   * @default false
   */
  required?: boolean;
};

export type FormControlLabelProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"label">, keyof BaseProps<P>>;

export interface FormControlLabelFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: FormControlLabelProps<P>): JSX.Element;
}

declare const FormControlLabel: FormControlLabelFC<{}>;

export default FormControlLabel;
