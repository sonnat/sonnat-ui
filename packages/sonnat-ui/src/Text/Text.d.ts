import * as React from "react";
import {
  OverridableComponent,
  OverrideProps
} from "../utils/typings/OverridableComponent";

export type TextTypeMap<P = {}, N extends React.ElementType = "span"> = {
  defaultRootNode: N;
  props: P & {
    /**
     * Applies the theme typography styles.
     */
    variant?:
      | "h1"
      | "h2"
      | "h3"
      | "h4"
      | "h5"
      | "h6"
      | "heroText"
      | "titleText"
      | "bodyText"
      | "captionText";
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
     * The color of the text.
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
      | "info" = "inherit";
    /**
     * Set the text-align on the text.
     */
    align?: "initial" | "inherit" | "left" | "center" | "right" | "justify";
    /**
     * Set the display on the component.
     * @default "initial"
     */
    display?:
      | "initial"
      | "block"
      | "inline"
      | "inline-block"
      | "flex"
      | "inline-flex";
    /**
     * Set the text-overflow on the text.
     * @default "ellipsis"
     */
    textOverflow?: "clip" | "ellipsis";
    /**
     * Applies the weighted typography styles based on the theme.
     */
    weight?: "bolder" | "lighter";
    /**
     * Applies the sized typography styles based on the theme.
     * @default "large"
     */
    size?: "large" | "medium" | "small" | "extraSmall";
    /**
     * If `true`,
     * the responsive behaviour of this typography class will apply to the component.
     * @default false
     */
    responsive?: boolean;
    /**
     * If `true`, the text will not wrap,
     * but instead will truncate or clip based on the `textOverflow` prop provided.
     *
     * Note that text overflow can only happen
     * when the element has a width in order to overflow.
     * ('block', 'inline-block', 'flex', 'inline-flex')
     * @default false
     */
    noWrap?: boolean;
  };
};

export type TextProps<
  P = {},
  N extends React.ElementType = TextTypeMap["defaultRootNode"]
> = OverrideProps<TextTypeMap<P, N>, N>;

declare const Text: OverridableComponent<TextTypeMap<{}, "span">>;

export default Text;
