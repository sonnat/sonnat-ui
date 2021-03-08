import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import fontIconVariables from "../styles/fontIconVariables.json";
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

const camelCase = s => s.replace(/-./g, x => x[1].toUpperCase());

const getIconVariableFromProp = (identifier = "") => {
  const id = camelCase(identifier);

  return fontIconVariables[id] || "";
};

const generateIdentifiers = () => {
  const blackList = ["fontFamily", "fontPath"];

  return Object.keys(fontIconVariables).reduce((result, key) => {
    if (blackList.includes(key)) return result;

    const value = fontIconVariables[key];

    return { ...result, [key]: { "&:before": { content: value } } };
  }, {});
};

const iconIdentifiers = generateIdentifiers();

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      colors,
      direction,
      typography: { fontFamily, pxToRem }
    } = theme;

    return {
      ...iconIdentifiers,
      root: {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        direction,
        fontFamily: `${fontFamily.icon} !important`,
        speak: "none",
        fontStyle: "normal",
        fontWeight: "normal",
        fontVariant: "normal",
        textTransform: "none",
        lineHeight: "1",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& > svg": {
          width: "100%",
          height: "100%"
        },
        textDecoration: "none"
      },
      defaultIcon: {
        width: pxToRem(16),
        height: pxToRem(16),
        minWidth: pxToRem(16),
        minHeight: pxToRem(16),
        fontSize: pxToRem(16)
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

const Icon = React.memo(
  React.forwardRef(function Icon(props, ref) {
    const {
      className,
      identifier,
      size,
      style: otherStyles,
      color = "inherit",
      rootNode: HTMLTag = "i",
      ...otherProps
    } = props;

    const variableKey = getIconVariableFromProp(identifier);
    const hasValidIdentifier = variableKey != null && variableKey.length > 0;
    const hasValidSize =
      size != null ? typeof size === "number" && !isNaN(size) : true;

    if (!hasValidIdentifier && process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(
        `[Sonnat]: There is no sonnat-icon with \`identifier={"${identifier}"}\`!`
      );
    }

    if (!hasValidSize) {
      throw new Error(
        `[Sonnat]: Invalid size provided! (provided value: \`size={${size}}\`)`
      );
    }

    const localClass = useStyles();
    const theme = useTheme();

    const identifierClassName = hasValidIdentifier
      ? localClass[camelCase(identifier)]
      : undefined;

    const sizeStyles =
      size != null
        ? {
            width: theme.typography.pxToRem(size),
            height: theme.typography.pxToRem(size),
            minWidth: theme.typography.pxToRem(size),
            minHeight: theme.typography.pxToRem(size),
            fontSize: theme.typography.pxToRem(size)
          }
        : {};

    return (
      <HTMLTag
        aria-hidden="true"
        style={{ ...otherStyles, ...sizeStyles }}
        className={createClass(
          localClass.root,
          localClass[`${color}Color`],
          identifierClassName,
          className,
          { [localClass.defaultIcon]: size != null || typeof size !== "number" }
        )}
        ref={ref}
        {...otherProps}
      />
    );
  })
);

Icon.displayName = componentName;

Icon.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.oneOf(colorEnum),
  rootNode: PropTypes.elementType,
  identifier: PropTypes.string,
  size: PropTypes.number
};

export default Icon;
