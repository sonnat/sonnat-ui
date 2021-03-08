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
   * The variant of the component.
   * @default "node"
   */
  variant?: "node" | "icon" | "text";
};

export type InputAdornmentProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface InputAdornmentFC<P> {
  // eslint-disable-next-line no-unused-vars
  (props: InputAdornmentProps<P>): JSX.Element;
}

declare const InputAdornment: InputAdornmentFC<{}>;

export default InputAdornment;
