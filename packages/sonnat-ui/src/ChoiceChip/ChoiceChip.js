import React, { useRef } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import Icon from "../Icon";
import useControlled from "../utils/useControlled";
import makeStyles from "../styles/makeStyles";
import { adjustColor, changeColor } from "../styles/colorUtils";

const componentName = "ChoiceChip";
const allowedVariants = ["filled", "outlined"];
const allowedSizes = ["medium", "small"];

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { useFontIconSize, useDisableUserSelect },
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    const filledCheckedMainBg = !darkMode
      ? colors.primary.origin
      : colors.primary.light;

    const filledChecked = {
      background: {
        main: filledCheckedMainBg,
        hover: adjustColor(filledCheckedMainBg, {
          saturation: -8,
          lightness: +8
        }),
        active: adjustColor(filledCheckedMainBg, {
          saturation: +8,
          lightness: -4
        })
      },
      text: colors.getContrastColorOf(filledCheckedMainBg)
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
        ...useFontIconSize(16),
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
      checked: {},
      filled: {
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
      outlined: {
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
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      filledChecked: {
        backgroundColor: filledChecked.background.main,
        color: filledChecked.text,
        "& $icon": { color: filledChecked.text },
        "&:hover, &:focus": {
          backgroundColor: filledChecked.background.hover
        },
        "&:active": {
          backgroundColor: filledChecked.background.active
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      outlinedChecked: {
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
      checked,
      defaultChecked: defaultCheckedProp,
      variant = "filled",
      size = "medium",
      rounded = false,
      ...otherProps
    } = props;

    const localClass = useStyles();

    const { current: defaultChecked } = useRef(
      checked != null
        ? undefined
        : defaultCheckedProp != null
        ? defaultCheckedProp
        : false
    );

    const [isChecked, setChecked] = useControlled(
      checked,
      defaultChecked,
      componentName
    );

    const toggleHandler = e => {
      if (onToggle) onToggle(e, !isChecked);
      if (onClick) onClick(e);
      setChecked(!isChecked);
    };

    const hasValidVariant = allowedVariants.includes(variant);
    const hasValidSize = allowedSizes.includes(size);

    return label ? (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={toggleHandler}
        className={createClass(localClass.root, className, {
          [localClass[size]]: hasValidSize,
          [localClass[variant]]: hasValidVariant && !isChecked,
          [localClass[camelCase(`${variant}-checked`)]]:
            hasValidVariant && isChecked,
          [localClass.rounded]: rounded,
          [localClass.iconed]: leadingIcon,
          [localClass.checked]: isChecked
        })}
        {...otherProps}
      >
        {leadingIcon && (
          <Icon
            identifier={leadingIcon}
            className={createClass(localClass.icon)}
          />
        )}
        {label}
      </div>
    ) : null;
  })
);

ChoiceChip.displayName = componentName;

ChoiceChip.propTypes = {
  label: PropTypes.string.isRequired,
  leadingIcon: PropTypes.string,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onToggle: PropTypes.func,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(["medium", "small"]),
  variant: PropTypes.oneOf(allowedVariants)
};

export default ChoiceChip;
