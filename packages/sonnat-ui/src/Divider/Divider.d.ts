import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../typings";

type BaseProps<
  P extends Record<string, unknown> = EmptyIntersectionObject,
  T extends React.ElementType = "hr"
> = P & {
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  rootNode?: T;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the divider will have spaces around it.
   * @default false
   */
  spaced?: boolean;
  /**
   * If `true`, the divider will be rendered as 3-dots instead of a straight line.
   *
   * You can't use `dotted` along with `vertical`!
   * @default false
   */
  dotted?: boolean;
  /**
   * If `true`, the divider will be vertical.
   *
   * It only works in flexboxes!
   * (the parent should be a flexbox and the divider itself has to be a flex-item)
   * @default false
   */
  vertical?: boolean;
};

export type DividerProps<
  P extends Record<string, unknown> = EmptyIntersectionObject,
  T extends React.ElementType = "hr"
> = MergeElementProps<T, BaseProps<P, T>>;

declare const Divider: <T extends React.ElementType = "hr">(
  props: DividerProps<EmptyIntersectionObject, T>
) => JSX.Element;

export default Divider;
