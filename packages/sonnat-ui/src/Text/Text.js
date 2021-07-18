import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import makeStyles from "../styles/makeStyles";

const componentName = "Text";

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
];

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
];

const allowedAlignments = [
  "left",
  "right",
  "center",
  "justify",
  "inherit",
  "initial"
];

const allowedWeights = ["bold", "medium", "regular", "light"];

const allowedDisplays = [
  "inline",
  "block",
  "inline-block",
  "flex",
  "inline-flex",
  "inherit"
];

const allowedTextOverflows = ["clip", "ellipsis"];

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);

const generateStyles = variants => {
  const styles = {};

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
      weight,
      rootNode: HTMLTag = "span",
      textOverflow = "ellipsis",
      color = "inherit",
      noWrap = false,
      ...otherProps
    } = props;

    const classes = useStyles();

    let variantClass = "";
    if (variant && allowedVariants.includes(variant)) {
      variantClass = classes[`${variant}`] || "";
    }

    return (
      <HTMLTag
        ref={ref}
        className={clx(
          classes.root,
          classes[`${color}Color`],
          classes[`${textOverflow}Overflow`],
          className,
          variantClass,
          {
            [classes.noWrap]: noWrap,
            [classes[`${weight}Weight`]]: weight != null && !!weight,
            [classes[`${align}Alignment`]]: align != null && !!align,
            [classes[`${display}Display`]]: display != null && !!display
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
  variant: PropTypes.oneOf(allowedVariants).isRequired,
  rootNode: PropTypes.elementType,
  align: PropTypes.oneOf(allowedAlignments),
  color: PropTypes.oneOf(allowedColors),
  display: PropTypes.oneOf(allowedDisplays),
  textOverflow: PropTypes.oneOf(allowedTextOverflows),
  weight: PropTypes.oneOf(allowedWeights),
  className: PropTypes.string,
  noWrap: PropTypes.bool
};

export default Text;
