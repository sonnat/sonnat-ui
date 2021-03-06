import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}> = P & {
  /**
   * If provided the badge will be wrapped around this node.
   */
  children?: React.ReactElement;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The text content of the badge.
   */
  textContent?: string;
  /**
   * The props of the parent.
   *
   * If component has `children`,
   * this will be applied to the container of badge and the children element.
   * Otherwise this will be applied to the badge itself.
   */
  parentProps?: React.ComponentPropsWithRef<"span" | "div">;
  /**
   * The horizontal position of the badge.
   * @default "right"
   */
  horizontalPosition?: "left" | "right";
  /**
   * The vertical position of the badge.
   * @default "top"
   */
  verticalPosition?: "top" | "bottom";
  /**
   * The shape of the child the badge will be wrapped around.
   *
   * Set this for better positioning.
   * * @default "rectangular"
   */
  childShape?: "rectangular" | "circular";
  /**
   * The size of the badge when `variant="dotted"`.
   * @default "medium"
   */
  dotSize?: "large" | "medium" | "small";
  /**
   * The variant of the badge.
   * @default "filled"
   */
  variant?: "filled" | "dotted";
  /**
   * The color of the badge.
   * @default "default"
   */
  color?: "primary" | "secondary";
  /**
   * 	If `true`, the badge will be visible.
   * @default true
   */
  visible?: boolean;
};

export type BadgeProps<P = {}> = MergeElementProps<"span", BaseProps<P>>;

declare const Badge: (props: BadgeProps) => JSX.Element;

export default Badge;
