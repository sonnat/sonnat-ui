import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../../typings";

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
   * Use it on a series of sibling flex items to force them into widths equal to their content
   * (or equal widths if their content does not surpass their border-boxes)
   * while taking up all available horizontal space.
   * @default false
   */
  fill?: boolean;
  /**
   * Changes the alignment of flex item individually on the main axis in the flexbox.
   * @default "start"
   */
  mainAxisSelfAlignment?: ResponsivePropType<
    "start" | "end" | "center" | "between" | "around" | "evenly"
  >;
  /**
   * Changes the alignment of flex item individually on the cross axis in the flexbox.
   * @default "stretch"
   */
  crossAxisSelfAlignment?: ResponsivePropType<
    "start" | "end" | "center" | "baseline" | "stretch"
  >;
  /**
   * Pushes the flex items on the left side to the left.
   * @default false
   */
  autoMarginStart?: ResponsivePropType<boolean>;
  /**
   * Pushes the flex items on the right side to the right.
   * @default false
   */
  autoMarginEnd?: ResponsivePropType<boolean>;
  /**
   * Pushes the above flex items to the top.
   * @default false
   */
  autoMarginTop?: ResponsivePropType<boolean>;
  /**
   * Pushes the bottom flex items to the bottom.
   * @default false
   */
  autoMarginBottom?: ResponsivePropType<boolean>;
};

export type FlexItemProps<
  P extends Record<string, unknown> = EmptyIntersectionObject,
  T extends React.ElementType = "div"
> = MergeElementProps<T, BaseProps<P, T>>;

declare const FlexItem: <T extends React.ElementType = "div">(
  props: FlexItemProps<EmptyIntersectionObject, T>
) => JSX.Element;

export default FlexItem;
