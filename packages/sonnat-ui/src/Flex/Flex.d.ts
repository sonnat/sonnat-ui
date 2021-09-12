import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../typings";

type Breakpoint<T> = {
  xxs?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xlg?: T;
};

type ResponsivePropType<T> = T | Breakpoint<T>;

type BaseProps<
  P extends Record<string, unknown> = EmptyIntersectionObject,
  T extends React.ElementType = "div"
> = P & {
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  rootNode?: T;
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The variant of the flexbox.
   * @default "block"
   */
  variant?: ResponsivePropType<"block" | "inline">;
  /**
   * Changes how flex items wrap in the flexbox.
   * @default "nowrap"
   */
  wrap?: ResponsivePropType<"nowrap" | "wrap" | "wrap-reverse">;
  /**
   * Sets the direction of flex items in the flexbox.
   * @default "row"
   */
  direction?: ResponsivePropType<
    "row" | "column" | "row-reverse" | "column-reverse"
  >;
  /**
   * Changes the alignment of flex items on the main axis in the flexbox.
   * @default "start"
   */
  mainAxisAlignment?: ResponsivePropType<
    "start" | "end" | "center" | "between" | "around" | "evenly"
  >;
  /**
   * Changes the alignment of flex items on the cross axis in the flexbox.
   * @default "stretch"
   */
  crossAxisAlignment?: ResponsivePropType<
    "start" | "end" | "center" | "baseline" | "stretch"
  >;
  /**
   * Aligns flex items together on the cross axis in the flexbox.
   * (Note: This property has no effect on single rows of flex items.)
   * @default "start"
   */
  contentAlignment?: ResponsivePropType<
    "start" | "end" | "center" | "between" | "around" | "evenly" | "stretch"
  >;
};

export type FlexProps<
  P extends Record<string, unknown> = EmptyIntersectionObject,
  T extends React.ElementType = "div"
> = MergeElementProps<T, BaseProps<P, T>>;

declare const Flex: <T extends React.ElementType = "div">(
  props: FlexProps<EmptyIntersectionObject, T>
) => JSX.Element;

export default Flex;
