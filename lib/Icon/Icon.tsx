import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import useTheme from "../styles/useTheme";
import type { MergeElementProps } from "../typings";
import useStyles, { type ColorCombo } from "./styles";

interface IconBaseProps {
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
}

export type IconProps = MergeElementProps<"svg", IconBaseProps>;

type Component = {
  (props: IconProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<IconProps> | undefined;
  displayName?: string | undefined;
};

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

const IconBase = (props: IconProps, ref: React.Ref<SVGSVGElement>) => {
  const {
    children,
    className,
    color,
    title,
    style: otherStyles,
    viewBox = "0 0 24 24",
    size = "auto",
    ...otherProps
  } = props;

  const classes = useStyles();
  const theme = useTheme();

  const hasValidSize =
    (typeof size === "number" && !isNaN(size)) ||
    (typeof size === "string" && size === "auto");

  const hasValidColor =
    color != null
      ? typeof color === "string" && allowedColors.includes(color)
      : true;

  if (process.env.NODE_ENV !== "production") {
    if (!hasValidSize) {
      // eslint-disable-next-line no-console
      console.error(
        `Sonnat: Invalid size provided! (provided size: \`size=${
          typeof size === "number" ? `{${size}}` : `"${String(size)}"`
        }\`)`
      );
    }

    if (!hasValidColor) {
      // eslint-disable-next-line no-console
      console.error(
        `Sonnat: Invalid color provided! (provided color: \`color={${String(
          color
        )}}\`)`
      );
    }
  }

  const sizeStyles =
    size === "auto"
      ? {
          width: "100%",
          height: "100%"
        }
      : {
          width: theme.typography.pxToRem(size),
          height: theme.typography.pxToRem(size),
          minWidth: theme.typography.pxToRem(size),
          minHeight: theme.typography.pxToRem(size)
        };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      style={{ ...otherStyles, ...sizeStyles }}
      className={c(
        classes.root,
        classes[`${String(color)}Color` as ColorCombo],
        className,
        {
          [classes.defaultSize]: size == null || !hasValidSize,
          [classes[`${String(color)}Color` as ColorCombo]]:
            color != null && hasValidColor
        }
      )}
      ref={ref}
      {...otherProps}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
};

const Icon = React.forwardRef(IconBase) as Component;

Icon.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
  viewBox: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.oneOf(allowedColors),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(["auto"])])
};

export default Icon;
