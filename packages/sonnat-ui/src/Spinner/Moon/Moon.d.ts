import * as React from "react";

type BaseProps<P = {}> = P & {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Sets the backgroundColor of the Spinner.
   */
  backgroundColor?: string;
  /**
   * Sets the foregroundColor of the Spinner.
   */
  foregroundColor?: string;
  /**
   * The size of the Spinner in pixels.
   */
  size?: number;
};

export type MoonSpinnerProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface MoonSpinnerFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: MoonSpinnerProps<P>): JSX.Element;
}

declare const MoonSpinner: MoonSpinnerFC<{}>;

export default MoonSpinner;
