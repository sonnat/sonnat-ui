import clx from "classnames";
import PropTypes from "prop-types";
import React, { useRef } from "react";
import { adjustColor, changeColor } from "../styles/colorUtils";
import makeStyles from "../styles/makeStyles";
import getVar from "../utils/getVar";
import useControlled from "../utils/useControlled";

const componentName = "ChoiceChip";

const allowedVariants = ["filled", "outlined"];
const allowedSizes = ["large", "medium", "small"];
const allowedColors = ["default", "primary", "secondary"];

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { useIconWrapper, useDisableUserSelect },
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    const filledDefaultMainBg = colors.text.secondary;
    const filledPrimarySelectedMainBg = !darkMode
      ? colors.primary.origin
      : colors.primary.light;

    const filledSecondarySelectedMainBg = !darkMode
      ? colors.secondary.origin
      : colors.secondary.light;

    const filledDefault = {
      background: {
        main: filledDefaultMainBg,
        hover: !darkMode
          ? adjustColor(filledDefaultMainBg, { lightness: 12 })
          : colors.createWhiteColor({ alpha: 0.98 }),
        active: !darkMode
          ? colors.createBlackColor({ alpha: 0.6 })
          : colors.createWhiteColor({ alpha: 0.5 })
      },
      text: colors.getContrastColorOf(filledDefaultMainBg)
    };

    const filledPrimarySelected = {
      background: {
        main: filledPrimarySelectedMainBg,
        hover: adjustColor(filledPrimarySelectedMainBg, {
          saturation: -8,
          lightness: +8
        }),
        active: adjustColor(filledPrimarySelectedMainBg, {
          saturation: +8,
          lightness: -4
        })
      },
      text: colors.getContrastColorOf(filledPrimarySelectedMainBg)
    };

    const filledSecondarySelected = {
      background: {
        main: filledSecondarySelectedMainBg,
        hover: adjustColor(filledSecondarySelectedMainBg, {
          saturation: -8,
          lightness: +8
        }),
        active: adjustColor(filledSecondarySelectedMainBg, {
          saturation: +8,
          lightness: -4
        })
      },
      text: colors.getContrastColorOf(filledSecondarySelectedMainBg)
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
        height: pxToRem(20),
        fontSize: pxToRem(10),
        padding: `0 ${pxToRem(8)}`,
        lineHeight: 1.8,
        "& $icon": {
          ...useIconWrapper(14),
          ...(direction === "rtl"
            ? { marginRight: pxToRem(-2), marginLeft: pxToRem(4) }
            : { marginLeft: pxToRem(-2), marginRight: pxToRem(4) })
        }
      },
      medium: {
        height: pxToRem(28),
        fontSize: pxToRem(12),
        lineHeight: 1.6666666667,
        "& $icon": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(-6), marginLeft: pxToRem(4) }
            : { marginLeft: pxToRem(-6), marginRight: pxToRem(4) })
        }
      },
      large: {
        height: pxToRem(32),
        fontSize: pxToRem(14),
        lineHeight: 1.5714285714,
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
      selected: {},
      filled: {
        "&$disabled": {
          "&:not($selected)": {
            backgroundColor: !darkMode
              ? colors.pallete.grey[100]
              : colors.pallete.grey[900],
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 })
              : colors.createWhiteColor({ alpha: 0.12 }),
            "& $icon": {
              color: !darkMode
                ? colors.createBlackColor({ alpha: 0.32 })
                : colors.createWhiteColor({ alpha: 0.12 })
            }
          },
          "&$selected": {
            backgroundColor: !darkMode
              ? colors.pallete.grey[300]
              : colors.pallete.grey[700],
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 })
              : colors.createWhiteColor({ alpha: 0.32 }),
            "& $icon": {
              color: !darkMode
                ? colors.createBlackColor({ alpha: 0.32 })
                : colors.createWhiteColor({ alpha: 0.32 })
            }
          }
        }
      },
      outlined: {
        "&$disabled": {
          backgroundColor: colors.transparent
        }
      },
      filledUnselected: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 })
          : colors.createWhiteColor({ alpha: 0.04 }),
        color: colors.text.secondary,
        "& $icon": { color: colors.text.secondary },
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
      outlinedUnselected: {
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
      filledDefaultSelected: {
        backgroundColor: filledDefault.background.main,
        color: filledDefault.text,
        "& $icon": { color: filledDefault.text },
        "&:hover, &:focus": {
          backgroundColor: filledDefault.background.hover
        },
        "&:active": {
          backgroundColor: filledDefault.background.active
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      filledPrimarySelected: {
        backgroundColor: filledPrimarySelected.background.main,
        color: filledPrimarySelected.text,
        "& $icon": { color: filledPrimarySelected.text },
        "&:hover, &:focus": {
          backgroundColor: filledPrimarySelected.background.hover
        },
        "&:active": {
          backgroundColor: filledPrimarySelected.background.active
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      filledSecondarySelected: {
        backgroundColor: filledSecondarySelected.background.main,
        color: filledSecondarySelected.text,
        "& $icon": { color: filledSecondarySelected.text },
        "&:hover, &:focus": {
          backgroundColor: filledSecondarySelected.background.hover
        },
        "&:active": {
          backgroundColor: filledSecondarySelected.background.active
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      outlinedDefaultSelected: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 })
          : colors.createWhiteColor({ alpha: 0.04 }),
        border: `${pxToRem(1)} solid ${
          !darkMode
            ? colors.createBlackColor({ alpha: 0.48 })
            : colors.createWhiteColor({ alpha: 0.48 })
        }`,
        color: colors.text.secondary,
        "& $icon": { color: colors.text.secondary },
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
        "&$disabled": {
          backgroundColor: !darkMode
            ? colors.pallete.grey[100]
            : colors.pallete.grey[900],
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.32 })
            : colors.createWhiteColor({ alpha: 0.32 }),
          "& $icon": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 })
              : colors.createWhiteColor({ alpha: 0.32 })
          },
          borderColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 })
            : colors.createWhiteColor({ alpha: 0.12 })
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      outlinedPrimarySelected: {
        backgroundColor: !darkMode
          ? colors.createPrimaryColor({ alpha: 0.04 })
          : changeColor(colors.primary.light, { alpha: 0.04 }),
        border: `${pxToRem(1)} solid ${
          !darkMode ? colors.primary.origin : colors.primary.light
        }`,
        color: !darkMode ? colors.primary.origin : colors.primary.light,
        "& $icon": {
          color: !darkMode ? colors.primary.origin : colors.primary.light
        },
        "&:hover, &:focus": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.12 })
            : changeColor(colors.primary.light, { alpha: 0.12 })
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.24 })
            : changeColor(colors.primary.light, { alpha: 0.24 })
        },
        "&$disabled": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.12 })
            : changeColor(colors.primary.light, { alpha: 0.12 }),
          color: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.32 })
            : changeColor(colors.primary.light, { alpha: 0.32 }),
          "& $icon": {
            color: !darkMode
              ? colors.createPrimaryColor({ alpha: 0.32 })
              : changeColor(colors.primary.light, { alpha: 0.32 })
          },
          borderColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.12 })
            : changeColor(colors.primary.light, { alpha: 0.12 })
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      outlinedSecondarySelected: {
        backgroundColor: !darkMode
          ? colors.createSecondaryColor({ alpha: 0.04 })
          : changeColor(colors.secondary.light, { alpha: 0.04 }),
        border: `${pxToRem(1)} solid ${
          !darkMode ? colors.secondary.origin : colors.secondary.light
        }`,
        color: !darkMode ? colors.secondary.origin : colors.secondary.light,
        "& $icon": {
          color: !darkMode ? colors.secondary.origin : colors.secondary.light
        },
        "&:hover, &:focus": {
          backgroundColor: !darkMode
            ? colors.createSecondaryColor({ alpha: 0.12 })
            : changeColor(colors.secondary.light, { alpha: 0.12 })
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createSecondaryColor({ alpha: 0.24 })
            : changeColor(colors.secondary.light, { alpha: 0.24 })
        },
        "&$disabled": {
          backgroundColor: !darkMode
            ? colors.createSecondaryColor({ alpha: 0.12 })
            : changeColor(colors.secondary.light, { alpha: 0.12 }),
          color: !darkMode
            ? colors.createSecondaryColor({ alpha: 0.32 })
            : changeColor(colors.secondary.light, { alpha: 0.32 }),
          "& $icon": {
            color: !darkMode
              ? colors.createSecondaryColor({ alpha: 0.32 })
              : changeColor(colors.secondary.light, { alpha: 0.32 })
          },
          borderColor: !darkMode
            ? colors.createSecondaryColor({ alpha: 0.12 })
            : changeColor(colors.secondary.light, { alpha: 0.12 })
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

const ChoiceChip = React.memo(
  React.forwardRef(function ChoiceChip(props, ref) {
    const {
      className,
      label,
      leadingIcon,
      onToggle,
      onClick,
      selected,
      defaultSelected: defaultSelectedProp,
      variant: variantProp = "filled",
      size: sizeProp = "medium",
      color: colorProp = "default",
      disabled = false,
      rounded = false,
      ...otherProps
    } = props;

    const classes = useStyles();

    const { current: defaultSelected } = useRef(
      selected != null
        ? undefined
        : defaultSelectedProp != null
        ? defaultSelectedProp
        : false
    );

    const [isSelected, setSelected] = useControlled(
      selected,
      defaultSelected,
      componentName
    );

    const toggleHandler = e => {
      if (onToggle) onToggle(e, !isSelected);
      if (onClick) onClick(e);
      setSelected(!isSelected);
    };

    const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

    const color = getVar(
      colorProp,
      "default",
      !allowedColors.includes(colorProp)
    );

    const variant = getVar(
      variantProp,
      "filled",
      !allowedVariants.includes(variantProp)
    );

    return label ? (
      <div
        ref={ref}
        role="button"
        aria-disabled={disabled ? "true" : "false"}
        tabIndex={disabled ? -1 : 0}
        onClick={toggleHandler}
        className={clx(
          className,
          classes.root,
          classes[size],
          classes[variant],
          {
            [classes.selected]: isSelected,
            [classes[camelCase(`${variant}-unselected`)]]: !isSelected,
            [classes[camelCase(`${variant}-${color}-selected`)]]: isSelected,
            [classes.rounded]: rounded,
            [classes.disabled]: disabled
          }
        )}
        {...otherProps}
      >
        {leadingIcon && <i className={clx(classes.icon)}>{leadingIcon}</i>}
        {label}
      </div>
    ) : null;
  })
);

ChoiceChip.displayName = componentName;

ChoiceChip.propTypes = {
  label: PropTypes.string.isRequired,
  leadingIcon: PropTypes.node,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  defaultSelected: PropTypes.bool,
  onToggle: PropTypes.func,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(allowedSizes),
  color: PropTypes.oneOf(allowedColors),
  variant: PropTypes.oneOf(allowedVariants)
};

export default ChoiceChip;
