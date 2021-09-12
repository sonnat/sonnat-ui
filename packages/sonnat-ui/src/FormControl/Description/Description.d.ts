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
     * If `true`, the description will appear as disabled.
     * @default false
     */
    disabled?: boolean;
  };

export type FormControlDescriptionProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"p", BaseProps<P>>;

declare const FormControlDescription: (
  props: FormControlDescriptionProps
) => JSX.Element;

export default FormControlDescription;
