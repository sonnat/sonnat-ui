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

export type FormControlLabelProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"label", BaseProps<P>>;

declare const FormControlLabel: (props: FormControlLabelProps) => JSX.Element;

export default FormControlLabel;
