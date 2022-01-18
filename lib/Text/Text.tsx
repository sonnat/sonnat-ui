import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { Variants } from "../styles";
import makeStyles from "../styles/makeStyles";
import type { MergeElementProps } from "../typings";
import { camelCase, getVar } from "../utils";

interface TextBaseProps {
  /**
   * Applies the theme typography styles.
   */
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle"
    | "subtitleSmall"
    | "body"
    | "bodySmall"
    | "caption"
    | "captionSmall";
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
    | "info";
  /**
   * Set the text-align on the text.
   */
  align?: "initial" | "inherit" | "left" | "center" | "right" | "justify";
  /**
   * Set the font-weight on the text.
   */
  weight?: "bold" | "medium" | "regular" | "light";
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
   * If `true`, the text will not wrap,
   * but instead will truncate or clip based on the `textOverflow` prop provided.
   *
   * Note that text overflow can only happen
   * when the element has a width in order to overflow.
   * ('block', 'inline-block', 'flex', 'inline-flex')
   * @default false
   */
  noWrap?: boolean;
}

export type TextProps<T extends React.ElementType = "span"> = MergeElementProps<
  T,
  TextBaseProps & {
    /**
     * The component used for the root node.
     * Either a string to use a HTML element or a component.
     */
    as?: T;
  }
>;

type Component = {
  <T extends React.ElementType = "span">(props: TextProps<T>): JSX.Element;
  propTypes?: React.WeakValidationMap<TextProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "subtitle",
  "subtitleSmall",
  "body",
  "bodySmall",
  "caption",
  "captionSmall"
] as const;

const allowedColors = [
  "inherit",
  "textPrimary",
  "textSecondary",
  "textHint",
  "textDisabled",
  "primary",
  "secondary",
  "error",
  "success",
  "warning",
  "info"
] as const;

const allowedAlignments = [
  "left",
  "right",
  "center",
  "justify",
  "inherit",
  "initial"
] as const;

const allowedWeights = ["bold", "medium", "regular", "light"] as const;

const allowedDisplays = [
  "initial",
  "inline",
  "block",
  "inline-block",
  "flex",
  "inline-flex",
  "inherit"
] as const;

const allowedTextOverflows = ["clip", "ellipsis"] as const;

const generateStyles = (variants: Variants) => {
  const styles: Record<string, React.CSSProperties> = {};

  allowedAlignments.forEach(alignment => {
    styles[`${alignment}Alignment`] = { textAlign: alignment };
  });

  allowedDisplays.forEach(display => {
    styles[`${camelCase(display)}Display`] = { display };
  });

  allowedTextOverflows.forEach(overflow => {
    styles[`${overflow}Overflow`] = { textOverflow: overflow };
  });

  allowedVariants.forEach(v => {
    const variant = variants[v];

    if (!variant) return;

    styles[v] = variant;
  });

  return styles;
};

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      typography: { variants, fontFamily, fontWeight }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        textDecoration: "none"
      },
      noWrap: {
        whiteSpace: "nowrap",
        overflow: "hidden"
      },
      inheritColor: { color: "inherit" },
      textPrimaryColor: { color: colors.text.primary },
      textSecondaryColor: { color: colors.text.secondary },
      textHintColor: { color: colors.text.hint },
      textDisabledColor: { color: colors.text.disabled },
      primaryColor: {
        color: !darkMode ? colors.primary.origin : colors.primary.light
      },
      secondaryColor: {
        color: !darkMode ? colors.secondary.origin : colors.secondary.light
      },
      errorColor: {
        color: !darkMode ? colors.error.origin : colors.error.light
      },
      successColor: {
        color: !darkMode ? colors.success.origin : colors.success.light
      },
      warningColor: {
        color: !darkMode ? colors.warning.origin : colors.warning.light
      },
      infoColor: { color: !darkMode ? colors.info.origin : colors.info.light },
      boldWeight: { fontWeight: `${fontWeight.bold} !important` },
      mediumWeight: { fontWeight: `${fontWeight.medium} !important` },
      regularWeight: { fontWeight: `${fontWeight.regular} !important` },
      lightWeight: { fontWeight: `${fontWeight.light} !important` },
      ...generateStyles(variants)
    };
  },
  { name: "SonnatText" }
);

const TextBase = (props: TextProps, ref: React.Ref<HTMLSpanElement>) => {
  const {
    children,
    className,
    align,
    display,
    weight,
    variant: variantProp,
    as: RootNode = "span",
    textOverflow = "ellipsis",
    color = "inherit",
    noWrap = false,
    ...otherProps
  } = props;

  const classes = useStyles();

  const variant = getVar(
    variantProp,
    "body",
    !allowedVariants.includes(variantProp)
  );

  const displayClass =
    display && allowedDisplays.includes(display)
      ? classes[
          `${camelCase(display)}Display` as unknown as keyof typeof classes
        ]
      : undefined;

  const alignClass =
    align && allowedAlignments.includes(align)
      ? classes[
          `${camelCase(align)}Alignment` as unknown as keyof typeof classes
        ]
      : undefined;

  const weightClass =
    weight && allowedWeights.includes(weight)
      ? classes[`${camelCase(weight)}Weight` as unknown as keyof typeof classes]
      : undefined;

  return (
    <RootNode
      ref={ref}
      className={c(
        className,
        displayClass,
        alignClass,
        weightClass,
        classes.root,
        classes[`${color}Color`],
        classes[variant as keyof typeof classes],
        classes[`${textOverflow}Overflow` as keyof typeof classes],
        { [classes.noWrap]: noWrap }
      )}
      {...otherProps}
    >
      {children}
    </RootNode>
  );
};

const Text = React.forwardRef(TextBase) as Component;

Text.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(allowedVariants).isRequired,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  as: PropTypes.elementType,
  align: PropTypes.oneOf(allowedAlignments),
  color: PropTypes.oneOf(allowedColors),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  display: PropTypes.oneOf(allowedDisplays),
  textOverflow: PropTypes.oneOf(allowedTextOverflows),
  weight: PropTypes.oneOf(allowedWeights),
  className: PropTypes.string,
  noWrap: PropTypes.bool
};

export default Text;
