import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /** The content of the container. */
    children?: React.ReactNode;
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /**
     * Determine whether the container should be fluid (max-width: 100%) or not.
     * If `true`, the container will be fluid in all breakpoints.
     * If `false`, the container will not be fluid.
     * If set to breakpoint ("xxs", "xs" and etc.), It will be applied for that breakpoint and wider screens.
     * @default false
     */
    fluid?: boolean | "xxs" | "xs" | "sm" | "md" | "lg" | "xlg";
    /**
     * If `true`, the paddings will be removed.
     * @default false
     */
    noPadding?: boolean;
  };

export type ContainerProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"div", BaseProps<P>>;

declare const Container: (props: ContainerProps) => JSX.Element;

export default Container;
