import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
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
  P extends Record<string, unknown> = EmptyIntersectionObject,
  T extends React.ElementType = "div"
> = MergeElementProps<T, BaseProps<P, T>>;

declare const MoonSpinner: (props: MoonSpinnerProps) => JSX.Element;

export default MoonSpinner;
