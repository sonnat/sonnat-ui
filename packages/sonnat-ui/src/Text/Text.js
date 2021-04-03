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
  "heroText",
  "titleText",
  "bodyText",
  "captionText"
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
const sizeEnum = ["large", "medium", "small", "extraSmall"];
const weightEnum = ["bolder", "lighter"];

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);
const getCorrectVariantKey = (variant, size, weight, sourceOfTruth) => {
  const validation = { variant: true, size: true, weight: true };

  if (!variant || !variantEnum.includes(variant)) validation.variant = false;
  if (!size || !sizeEnum.includes(size)) validation.size = false;
  if (!weight || !weightEnum.includes(weight)) validation.weight = false;

  if (!validation.variant) return "";
  else {
    let key = `${variant}`;
    const variantKey = key;
    const hasVariant = sourceOfTruth[key];

    if (!validation.size) return hasVariant ? variantKey : "";
    else {
      key += `-${size}`;
      const variantKeyWithSize = camelCase(key);
      const hasVariantWithSize = sourceOfTruth[variantKeyWithSize];

      if (!validation.weight)
        return hasVariantWithSize
          ? variantKeyWithSize
          : hasVariant
          ? variantKey
          : "";
      else {
        key += `-${weight}`;
        const variantKeyWithSizeWithWeight = camelCase(key);
        const hasVariantWithSizeWithWeight =
          sourceOfTruth[variantKeyWithSizeWithWeight];

        return hasVariantWithSizeWithWeight
          ? variantKeyWithSizeWithWeight
          : hasVariantWithSize
          ? variantKeyWithSize
          : hasVariant
          ? variantKey
          : "";
      }
    }
  }
};

const generateVariations = (variants, breakpoints) => {
  const styles = {};
  const responsiveStyles = {};

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
    if (variant.responsiveRules)
      responsiveStyles[`${v}`] = {
        "&$responsive": variant.responsiveRules
      };

    sizeEnum.forEach(size => {
      if (variant[size]) {
        if (variant[size].rules) {
          const key = camelCase(`${v}-${size}`);
          styles[key] = variant[size].rules;
        }

        if (variant[size].responsiveRules) {
          const key = camelCase(`${v}-${size}`);
          responsiveStyles[`${key}`] = {
            "&$responsive": variant[size].responsiveRules
          };
        }

        weightEnum.forEach(weight => {
          if (variant[size][weight]) {
            if (variant[size][weight].rules) {
              const key = camelCase(`${v}-${size}-${weight}`);
              styles[`${key}`] = variant[size][weight].rules;
            }

            if (variant[size][weight].responsiveRules) {
              const key = camelCase(`${v}-${size}-${weight}`);
              responsiveStyles[`${key}`] = {
                "&$responsive": variant[size][weight].responsiveRules
              };
            }
          }
        });
      }
    });
  });

  return { ...styles, [breakpoints.down("sm")]: responsiveStyles };
};

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      breakpoints,
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
      responsive: {},
      ...generateVariations(variants, breakpoints)
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
      weight,
      display,
      rootNode: HTMLTag = "span",
      textOverflow = "ellipsis",
      color = "inherit",
      size = "large",
      noWrap = false,
      responsive = false,
      ...otherProps
    } = props;

    const localClass = useStyles();

    const variantKey = getCorrectVariantKey(variant, size, weight, localClass);

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
            [localClass.responsive]: responsive,
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
  size: PropTypes.oneOf(sizeEnum),
  rootNode: PropTypes.elementType,
  align: PropTypes.oneOf(alignEnum),
  color: PropTypes.oneOf(colorEnum),
  display: PropTypes.oneOf(displayEnum),
  textOverflow: PropTypes.oneOf(textOverflowEnum),
  weight: PropTypes.oneOf(weightEnum),
  className: PropTypes.string,
  responsive: PropTypes.bool,
  noWrap: PropTypes.bool
};

export default Text;
