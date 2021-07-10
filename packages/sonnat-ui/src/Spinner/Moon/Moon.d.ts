import * as React from "react";
import type { MergeElementProps } from "../../typings";

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

export type MoonSpinnerProps<
  P = {},
  T extends React.ElementType = "div"
> = MergeElementProps<T, BaseProps<P, T>>;

declare const MoonSpinner: (props: MoonSpinnerProps) => JSX.Element;

export default MoonSpinner;
