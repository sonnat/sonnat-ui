import * as React from "react";

type BaseProps<P = {}> = P & {
  /**
   * If provided the badge will be added relative to this node.
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
   * The shape of the child the badge will overlap.
   *
   * Set this for better positioning.
   */
  childShape?: "rectangular" | "circular";
  /**
   * The size of the badge when `variant="dot"`.
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

export type BadgeProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"span">, keyof BaseProps<P>>;

export interface BadgeFC<P> {
  // eslint-disable-next-line no-unused-vars
  (props: BadgeProps<P>): JSX.Element;
}

declare const Badge: BadgeFC<{}>;

export default Badge;
