import * as React from "react";

type BaseProps<P = {}> = P & {
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
   * The viewBox of the SVG.
   *
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * @default "0 0 24 24"
   */
  viewBox?: string;
  /**
   * Provides a human-readable title for the element that contains it.
   * https://www.w3.org/TR/SVG-access/#Equivalent
   */
  title?: string;
  /**
   * The color of the icon.
   * @default "inherit"
   */
  color?:
    | "inherit"
    | "textPrimary"
    | "textSecondary"
    | "textHint"
    | "textDisabled"
    | "primary"
    | "secondary"
    | "error"
    | "success"
    | "warning"
    | "info";
  /**
   * The size of the icon.
   * If set to `"auto"`, the icon will get the parent's width and height.
   * @default "auto"
   */
  size?: number | "auto";
};

export type IconProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"svg">, keyof BaseProps<P>>;

export interface IconFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: IconProps<P>): JSX.Element;
}

declare const Icon: IconFC;

export default Icon;
