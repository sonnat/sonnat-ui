import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../styles/makeStyles";

const componentName = "Text";

const variantEnum = [
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
];

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

const alignEnum = ["left", "right", "center", "justify", "inherit", "initial"];
const displayEnum = [
  "inline",
  "block",
  "inline-block",
  "flex",
  "inline-flex",
  "inherit"
];
const textOverflowEnum = ["clip", "ellipsis"];

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);

const getCorrectVariantKey = (variant, sourceOfTruth) => {
  if (!variant || !variantEnum.includes(variant)) return "";

  const variantKey = `${variant}`;
  return sourceOfTruth[variantKey] ? variantKey : "";
};

const generateStyles = variants => {
  const styles = {};

  alignEnum.forEach(alignment => {
    styles[`${alignment}Alignment`] = { textAlign: alignment };
  });

  displayEnum.forEach(display => {
    styles[`${camelCase(display)}Display`] = { display };
  });

  textOverflowEnum.forEach(overflow => {
    styles[`${overflow}Overflow`] = { textOverflow: overflow };
  });

  variantEnum.forEach(v => {
    const variant = variants[v];

    if (!variant) return;
    if (variant.rules) styles[v] = variant.rules;
  });

  return styles;
};

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      typography: { variants, fontFamily }
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
      ...generateStyles(variants)
    };
  },
  { name: `Sonnat${componentName}` }
);

const Text = React.memo(
  React.forwardRef(function Text(props, ref) {
    const {
      children,
      className,
      variant,
      align,
      display,
      rootNode: HTMLTag = "span",
      textOverflow = "ellipsis",
      color = "inherit",
      noWrap = false,
      ...otherProps
    } = props;

    const localClass = useStyles();
    const variantKey = getCorrectVariantKey(variant, localClass);

    return (
      <HTMLTag
        ref={ref}
        className={createClass(
          className,
          localClass.root,
          localClass[variantKey],
          localClass[`${display}Display`],
          localClass[`${color}Color`],
          localClass[`${textOverflow}Overflow`],
          {
            [localClass.noWrap]: noWrap,
            [localClass[`${align}Alignment`]]: align != null && !!align,
            [localClass[`${display}Display`]]: display != null && !!display
          }
        )}
        {...otherProps}
      >
        {children}
      </HTMLTag>
    );
  })
);

Text.displayName = componentName;

Text.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(variantEnum).isRequired,
  rootNode: PropTypes.elementType,
  align: PropTypes.oneOf(alignEnum),
  color: PropTypes.oneOf(colorEnum),
  display: PropTypes.oneOf(displayEnum),
  textOverflow: PropTypes.oneOf(textOverflowEnum),
  className: PropTypes.string,
  noWrap: PropTypes.bool
};

export default Text;
