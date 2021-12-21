import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /** The content of the component. */
    children?: React.ReactNode;
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /**
     * If `true`, the feedback will indicate invalid input.
     * @default false
     */
    hasError?: boolean;
  };

export type FormControlFeedbackProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"div", BaseProps<P>>;

declare const FormControlFeedback: (
  props: FormControlFeedbackProps
) => JSX.Element;

export default FormControlFeedback;
