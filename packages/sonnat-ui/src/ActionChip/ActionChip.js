import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../styles/makeStyles";
import { adjustColor, changeColor } from "../styles/colorUtils";

const componentName = "ActionChip";
const allowedVariants = ["filled", "outlined"];
const allowedSizes = ["medium", "small"];
const allowedColors = ["default", "primary", "secondary"];

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      darkMode,
      mixins: { useIconWrapper, useDisableUserSelect },
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    const filledPrimaryMainBg = !darkMode
      ? colors.primary.origin
      : colors.primary.light;
    const filledSecondaryMainBg = !darkMode
      ? colors.secondary.origin
      : colors.secondary.light;

    const filledPrimary = {
      background: {
        main: filledPrimaryMainBg,
        hover: adjustColor(filledPrimaryMainBg, {
          saturation: -8,
          lightness: +8
        }),
        active: adjustColor(filledPrimaryMainBg, {
          saturation: +8,
          lightness: -4
        }),
        disabled: changeColor(filledPrimaryMainBg, { alpha: 0.12 })
      },
      text: colors.getContrastColorOf(filledPrimaryMainBg)
    };

    const filledSecondary = {
      background: {
        main: filledSecondaryMainBg,
        hover: adjustColor(filledSecondaryMainBg, {
          saturation: -8,
          lightness: +8
        }),
        active: adjustColor(filledSecondaryMainBg, {
          saturation: +8,
          lightness: -4
        }),
        disabled: changeColor(filledSecondaryMainBg, { alpha: 0.12 })
      },
      text: colors.getContrastColorOf(filledSecondaryMainBg)
    };

    return {
      root: {
        ...useText(),
        ...useDisableUserSelect(),
        direction,
        fontFamily: fontFamily[direction],
        padding: `0 ${pxToRem(12)}`,
        outline: "none",
        display: "inline-flex",
        alignItems: "center",
        alignSelf: "center",
        borderRadius: pxToRem(2),
        verticalAlign: "middle",
        overflow: "hidden",
        position: "relative",
        zIndex: "1",
        flexShrink: "0",
        cursor: "pointer",
        transition:
          "color 360ms ease, background-color 360ms ease, border 360ms ease"
      },
      icon: {
        ...useIconWrapper(16),
        flexShrink: "0",
        transition: "color 360ms ease"
      },
      small: {
        height: pxToRem(28),
        fontSize: pxToRem(12),
        "& $icon": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(-6), marginLeft: pxToRem(4) }
            : { marginLeft: pxToRem(-6), marginRight: pxToRem(4) })
        }
      },
      medium: {
        height: pxToRem(32),
        fontSize: pxToRem(14),
        "& $icon": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(-4), marginLeft: pxToRem(4) }
            : { marginLeft: pxToRem(-4), marginRight: pxToRem(4) })
        }
      },
      rounded: {
        borderRadius: pxToRem(16)
      },
      disabled: {
        pointerEvents: "none",
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      filled: {
        "&$disabled": {
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.32 })
            : colors.createWhiteColor({ alpha: 0.12 }),
          "& $icon": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 })
              : colors.createWhiteColor({ alpha: 0.12 })
          }
        }
      },
      outlined: {
        "&$disabled": {
          backgroundColor: colors.transparent
        }
      },
      filledDefault: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 })
          : colors.createWhiteColor({ alpha: 0.04 }),
        color: colors.text.secondary,
        "& $icon": { color: colors.text.secondary },
        "&$disabled": {
          backgroundColor: !darkMode
            ? colors.pallete.grey[100]
            : colors.pallete.grey[900]
        },
        "&:hover, &:focus": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 })
            : colors.createWhiteColor({ alpha: 0.12 })
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.24 })
            : colors.createWhiteColor({ alpha: 0.24 })
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      filledPrimary: {
        backgroundColor: filledPrimary.background.main,
        color: filledPrimary.text,
        "& $icon": { color: filledPrimary.text },
        "&$disabled": {
          backgroundColor: filledPrimary.background.disabled
        },
        "&:hover, &:focus": {
          backgroundColor: filledPrimary.background.hover
        },
        "&:active": {
          backgroundColor: filledPrimary.background.active
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      filledSecondary: {
        backgroundColor: filledSecondary.background.main,
        color: filledSecondary.text,
        "& $icon": { color: filledSecondary.text },
        "&$disabled": {
          backgroundColor: filledSecondary.background.disabled
        },
        "&:hover, &:focus": {
          backgroundColor: filledSecondary.background.hover
        },
        "&:active": {
          backgroundColor: filledSecondary.background.active
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      outlinedDefault: {
        backgroundColor: colors.transparent,
        border: `${pxToRem(1)} solid ${colors.divider}`,
        color: colors.text.secondary,
        "& $icon": { color: colors.text.secondary },
        "&:hover, &:focus": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 })
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 })
            : colors.createWhiteColor({ alpha: 0.12 })
        },
        "&$disabled": {
          borderColor: colors.divider,
          color: colors.text.disabled,
          "& $icon": { color: colors.text.disabled }
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      outlinedPrimary: {
        backgroundColor: changeColor(filledPrimaryMainBg, { alpha: 0.04 }),
        border: `${pxToRem(1)} solid ${filledPrimaryMainBg}`,
        color: filledPrimaryMainBg,
        "& $icon": { color: filledPrimaryMainBg },
        "&:hover, &:focus": {
          backgroundColor: changeColor(filledPrimaryMainBg, { alpha: 0.12 })
        },
        "&:active": {
          backgroundColor: changeColor(filledPrimaryMainBg, { alpha: 0.24 })
        },
        "&$disabled": {
          color: changeColor(filledPrimaryMainBg, { alpha: 0.32 }),
          "& $icon": {
            color: changeColor(filledPrimaryMainBg, { alpha: 0.32 })
          },
          borderColor: changeColor(filledPrimaryMainBg, { alpha: 0.12 })
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      outlinedSecondary: {
        backgroundColor: changeColor(filledSecondaryMainBg, { alpha: 0.04 }),
        border: `${pxToRem(1)} solid ${filledSecondaryMainBg}`,
        color: filledSecondaryMainBg,
        "& $icon": {
          color: filledSecondaryMainBg
        },
        "&:hover, &:focus": {
          backgroundColor: changeColor(filledSecondaryMainBg, { alpha: 0.12 })
        },
        "&:active": {
          backgroundColor: changeColor(filledSecondaryMainBg, { alpha: 0.24 })
        },
        "&$disabled": {
          color: changeColor(filledSecondaryMainBg, { alpha: 0.32 }),
          "& $icon": {
            color: changeColor(filledSecondaryMainBg, { alpha: 0.32 })
          },
          borderColor: changeColor(filledSecondaryMainBg, { alpha: 0.12 })
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const ActionChip = React.memo(
  React.forwardRef(function ActionChip(props, ref) {
    const {
      className,
      label,
      leadingIcon,
      size = "medium",
      variant = "filled",
      color = "default",
      disabled = false,
      rounded = false,
      ...otherProps
    } = props;

    const localClass = useStyles();

    const hasValidVariant = allowedVariants.includes(variant);
    const hasValidColor = allowedColors.includes(color);
    const hasValidSize = allowedSizes.includes(size);

    return label ? (
      <div
        ref={ref}
        role="button"
        aria-disabled={disabled ? "true" : "false"}
        tabIndex={disabled ? -1 : 0}
        className={createClass(localClass.root, className, {
          [localClass[size]]: hasValidSize,
          [localClass[variant]]: hasValidVariant,
          [localClass[camelCase(`${variant}-${color}`)]]:
            hasValidColor && hasValidVariant,
          [localClass.rounded]: rounded,
          [localClass.disabled]: disabled
        })}
        {...otherProps}
      >
        {leadingIcon && (
          <i className={createClass(localClass.icon)}>{leadingIcon}</i>
        )}
        {label}
      </div>
    ) : null;
  })
);

ActionChip.displayName = componentName;

ActionChip.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  disabled: PropTypes.bool,
  leadingIcon: PropTypes.node,
  size: PropTypes.oneOf(allowedSizes),
  color: PropTypes.oneOf(allowedColors),
  variant: PropTypes.oneOf(allowedVariants)
};

export default ActionChip;
