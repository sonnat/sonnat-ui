import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}, T extends React.ElementType = "span"> = {
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  rootNode?: T;
  /** Optional children to infer width and height from. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The ratio of the width to the height.
   *
   * Only works when `variant="rectangular"`.
   */
  ratio?: number;
  /**
   * Width of the skeleton.
   * Useful when the skeleton is inside an inline element with no width of its own.
   */
  width?: number | string;
  /**
   * Height of the skeleton.
   * Useful when you don't want to adapt the skeleton to a text element but for instance a card.
   */
  height?: number | string;
  /**
   * The type of content that will be rendered.
   * @default "text"
   */
  variant?: "circular" | "rectangular" | "text";
};

export type SkeletonProps<
  P = {},
  T extends React.ElementType = "span"
> = MergeElementProps<T, BaseProps<P, T>>;

declare const Skeleton: <T extends React.ElementType = "span">(
  props: SkeletonProps<{}, T>
) => JSX.Element;

export default Skeleton;
