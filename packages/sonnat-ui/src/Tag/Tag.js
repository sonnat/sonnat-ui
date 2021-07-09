import React from "react";
import PropTypes from "prop-types";
import useConstantProp from "../utils/useConstantProp";
import Close from "../internals/icons/Close";
import { changeColor } from "../styles/colorUtils";
import createClass from "classnames";
import makeStyles from "../styles/makeStyles";

const componentName = "Tag";

const allowedVariants = ["filled", "outlined"];
const allowedColors = [
  "default",
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info"
];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { useIconWrapper },
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    const primaryColor = !darkMode
      ? colors.primary.origin
      : colors.primary.light;
    const primaryBgColor = changeColor(primaryColor, { alpha: 0.08 });
    const primaryMiddleColor = changeColor(primaryColor, { alpha: 0.12 });
    const primaryBorderColor = changeColor(primaryColor, { alpha: 0.24 });

    const secondaryColor = !darkMode
      ? colors.secondary.origin
      : colors.secondary.light;
    const secondaryBgColor = changeColor(secondaryColor, { alpha: 0.08 });
    const secondaryMiddleColor = changeColor(secondaryColor, { alpha: 0.12 });
    const secondaryBorderColor = changeColor(secondaryColor, { alpha: 0.24 });

    const successColor = !darkMode
      ? colors.success.origin
      : colors.success.light;
    const successBgColor = changeColor(successColor, { alpha: 0.08 });
    const successMiddleColor = changeColor(successColor, { alpha: 0.12 });
    const successBorderColor = changeColor(successColor, { alpha: 0.24 });

    const errorColor = !darkMode ? colors.error.origin : colors.error.light;
    const errorBgColor = changeColor(errorColor, { alpha: 0.08 });
    const errorMiddleColor = changeColor(errorColor, { alpha: 0.12 });
    const errorBorderColor = changeColor(errorColor, { alpha: 0.24 });

    const warningColor = !darkMode
      ? colors.warning.origin
      : colors.warning.light;
    const warningBgColor = changeColor(warningColor, { alpha: 0.08 });
    const warningMiddleColor = changeColor(warningColor, { alpha: 0.12 });
    const warningBorderColor = changeColor(warningColor, { alpha: 0.24 });

    const infoColor = !darkMode ? colors.info.origin : colors.info.light;
    const infoBgColor = changeColor(infoColor, { alpha: 0.08 });
    const infoMiddleColor = changeColor(infoColor, { alpha: 0.12 });
    const infoBorderColor = changeColor(infoColor, { alpha: 0.24 });

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "middle",
        height: pxToRem(30),
        borderRadius: pxToRem(2),
        paddingRight: pxToRem(8),
        paddingLeft: pxToRem(8)
      },
      label: {
        ...useText({ fontSize: pxToRem(14), lineHeight: 1.5714285714 })
      },
      icon: {
        ...useIconWrapper(16),
        ...(direction === "rtl"
          ? { marginRight: pxToRem(-4), marginLeft: pxToRem(4) }
          : { marginLeft: pxToRem(-4), marginRight: pxToRem(4) })
      },
      removeBtn: {
        padding: "0",
        margin: "0",
        outline: "none",
        cursor: "pointer",
        borderRadius: "0",
        border: "none",
        minWidth: "auto",
        height: "100%",
        backgroundColor: colors.transparent,
        zIndex: "2",
        pointerEvents: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: "0",
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(-4), marginRight: pxToRem(4) }
          : { marginRight: pxToRem(-4), marginLeft: pxToRem(4) }),
        "&:hover > $removeBtnIcon": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      removeBtnIcon: {
        ...useIconWrapper(16),
        backgroundColor: colors.transparent,
        borderRadius: "50%",
        transition: "background-color 360ms ease, color 360ms ease"
      },
      outlined: {},
      dense: {
        height: pxToRem(24),
        "& $label": { fontSize: pxToRem(12) }
      },
      default: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 })
          : colors.createWhiteColor({ alpha: 0.04 }),
        "& $label": { color: colors.text.secondary },
        "& $icon": { color: colors.text.secondary },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${colors.divider}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          "&:hover > $removeBtnIcon, &:focus > $removeBtnIcon": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.12 })
              : colors.createWhiteColor({ alpha: 0.12 })
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.24 })
              : colors.createWhiteColor({ alpha: 0.24 })
          }
        }
      },
      primary: {
        color: primaryColor,
        backgroundColor: primaryBgColor,
        "& $label": { color: primaryColor },
        "& $icon": { color: primaryColor },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${primaryBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          "&:hover > $removeBtnIcon, &:focus > $removeBtnIcon": {
            backgroundColor: primaryMiddleColor
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: primaryBorderColor
          }
        }
      },
      secondary: {
        color: secondaryColor,
        backgroundColor: secondaryBgColor,
        "& $label": { color: secondaryColor },
        "& $icon": { color: secondaryColor },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${secondaryBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          "&:hover > $removeBtnIcon, &:focus > $removeBtnIcon": {
            backgroundColor: secondaryMiddleColor
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: secondaryBorderColor
          }
        }
      },
      success: {
        color: successColor,
        backgroundColor: successBgColor,
        "& $label": { color: successColor },
        "& $icon": { color: successColor },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${successBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          "&:hover > $removeBtnIcon, &:focus > $removeBtnIcon": {
            backgroundColor: successMiddleColor
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: successBorderColor
          }
        }
      },
      error: {
        color: errorColor,
        backgroundColor: errorBgColor,
        "& $label": { color: errorColor },
        "& $icon": { color: errorColor },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${errorBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          "&:hover > $removeBtnIcon, &:focus > $removeBtnIcon": {
            backgroundColor: errorMiddleColor
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: errorBorderColor
          }
        }
      },
      warning: {
        color: warningColor,
        backgroundColor: warningBgColor,
        "& $label": { color: warningColor },
        "& $icon": { color: warningColor },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${warningBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          "&:hover > $removeBtnIcon, &:focus > $removeBtnIcon": {
            backgroundColor: warningMiddleColor
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: warningBorderColor
          }
        }
      },
      info: {
        color: infoColor,
        backgroundColor: infoBgColor,
        "& $label": { color: infoColor },
        "& $icon": { color: infoColor },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${infoBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          "&:hover > $removeBtnIcon, &:focus > $removeBtnIcon": {
            backgroundColor: infoMiddleColor
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: infoBorderColor
          }
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Tag = React.memo(
  React.forwardRef(function Tag(props, ref) {
    const {
      className,
      icon,
      label,
      onRemove,
      variant = "filled",
      color = "default",
      visible = true,
      dense = false,
      ...otherProps
    } = props;

    const localClass = useStyles();

    const isRemovable = useConstantProp(onRemove != null, false, {
      componentName,
      propName: "onRemove"
    });

    return visible ? (
      <div
        ref={ref}
        className={createClass(localClass.root, className, {
          [localClass[variant]]: allowedVariants.includes(variant),
          [localClass[color]]: allowedColors.includes(color),
          [localClass.removable]: isRemovable,
          [localClass.dense]: dense
        })}
        {...otherProps}
      >
        {icon && <i className={localClass.icon}>{icon}</i>}
        <span className={localClass.label}>{label}</span>
        {isRemovable && (
          <div
            role="button"
            tabIndex={0}
            className={localClass.removeBtn}
            onClick={onRemove}
          >
            <i className={localClass.removeBtnIcon}>
              <Close />
            </i>
          </div>
        )}
      </div>
    ) : null;
  })
);

Tag.displayName = componentName;

Tag.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  dense: PropTypes.bool,
  visible: PropTypes.bool,
  variant: PropTypes.oneOf(allowedVariants),
  color: PropTypes.oneOf(allowedColors),
  onRemove: PropTypes.func
};

export default Tag;
