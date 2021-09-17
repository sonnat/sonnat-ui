import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import { makeStyles, useTheme } from "../styles";

const componentName = "Icon";

const colorEnum = [
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
];

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      colors,
      direction,
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        direction,
        userSelect: "none",
        speak: "none",
        display: "inline-block",
        verticalAlign: "middle",
        fontStyle: "normal",
        fontWeight: "normal",
        fontVariant: "normal",
        textTransform: "none",
        lineHeight: "1",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textDecoration: "none",
        fill: "currentColor",
        fontSize: pxToRem(14)
      },
      defaultSize: {
        width: pxToRem(16),
        height: pxToRem(16),
        minWidth: pxToRem(16),
        minHeight: pxToRem(16)
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
      infoColor: { color: !darkMode ? colors.info.origin : colors.info.light }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Icon = React.forwardRef(function Icon(props, ref) {
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
      ? typeof color === "string" && colorEnum.includes(color)
      : true;

  if (process.env.NODE_ENV !== "production") {
    if (!hasValidSize) {
      // eslint-disable-next-line no-console
      console.error(
        `Sonnat: Invalid size provided! (provided size: \`size=${
          typeof size === "number" ? `{${size}}` : `"${size}"`
        }\`)`
      );
    }

    if (!hasValidColor) {
      // eslint-disable-next-line no-console
      console.error(
        `Sonnat: Invalid color provided! (provided color: \`color={${color}}\`)`
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
      className={clx(classes.root, classes[`${color}Color`], className, {
        [classes.defaultSize]: size == null || !hasValidSize,
        [classes[`${color}Color`]]: color != null && hasValidColor
      })}
      ref={ref}
      {...otherProps}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
});

Icon.displayName = componentName;

Icon.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
  viewBox: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.oneOf(colorEnum),
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(["auto"])])
};

export default Icon;
