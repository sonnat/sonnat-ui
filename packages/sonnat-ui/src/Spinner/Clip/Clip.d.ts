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
   * Sets the foregroundColor (color of the strokes) of the Spinner.
   */
  foregroundColor?: string;
  /**
   * The size of the Spinner in pixels.
   */
  size?: number;
};

export type ClipSpinnerProps<
  P = {},
  T extends React.ElementType = "div"
> = MergeElementProps<T, BaseProps<P, T>>;

declare const ClipSpinner: (props: ClipSpinnerProps) => JSX.Element;

export default ClipSpinner;
