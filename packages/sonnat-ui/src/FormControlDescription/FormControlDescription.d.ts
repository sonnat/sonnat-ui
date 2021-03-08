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
   * If `true`, the description will appear as disabled.
   * @default false
   */
  disabled?: boolean;
};

export type FormControlDescriptionProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"p">, keyof BaseProps<P>>;

export interface FormControlDescriptionFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: FormControlDescriptionProps<P>): JSX.Element;
}

declare const FormControlDescription: FormControlDescriptionFC<{}>;

export default FormControlDescription;
