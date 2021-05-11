import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../styles/makeStyles";
import { adjustColor } from "../styles/colorUtils";

const componentName = "FloatingActionButton";
const allowedIconButtonSizes = ["large", "medium", "small"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      hacks,
      darkMode,
      direction,
      zIndexes: { sticky },
      mixins: { useIconWrapper },
      typography: { pxToRem, useText, fontWeight, fontFamily }
    } = theme;

    const mainBackground = !darkMode
      ? colors.primary.origin
      : colors.primary.light;

    const coloring = {
      background: {
        main: mainBackground,
        hover: adjustColor(mainBackground, {
          saturation: -8,
          lightness: +8
        }),
        active: adjustColor(mainBackground, {
          saturation: +8,
          lightness: -4
        })
      },
      text: colors.getContrastColorOf(mainBackground)
    };

    return {
      root: {
        ...(direction === "rtl"
          ? { right: pxToRem(32) }
          : { left: pxToRem(32) }),
        direction,
        fontFamily: fontFamily[direction],
        appearance: "none !important",
        textDecoration: "none",
        position: "fixed",
        bottom: pxToRem(32),
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: sticky,
        backgroundColor: coloring.background.main,
        outline: "none",
        border: "none",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        boxShadow:
          "0 1px 32px 0 rgba(0, 0, 0, 0.08)," +
          "0 12px 16px 0 rgba(0, 0, 0, 0.12)," +
          "0 8px 12px -6px rgba(0, 0, 0, 0.16)",
        borderRadius: "50%",
        transition:
          "background-color 360ms ease," +
          "transform 360ms ease," +
          "border-radius 360ms ease," +
          "box-shadow 400ms ease",
        "&:hover, &:focus": {
          backgroundColor: coloring.background.hover,
          boxShadow:
            "0 0 12px 0 rgba(0, 0, 0, 0.08)," +
            "0 4px 10px 0 rgba(0, 0, 0, 0.12)," +
            "0 2px 6px -1px rgba(0, 0, 0, 0.24)"
        },
        "&:active": { backgroundColor: coloring.background.active },
        "&:not($iconButton)": {
          minWidth: pxToRem(96),
          width: "auto",
          height: pxToRem(48),
          padding: `0 ${pxToRem(16)}`,
          borderRadius: pxToRem(24)
        }
      },
      label: {
        ...hacks.backfaceVisibilityFix,
        ...useText({
          color: coloring.text,
          fontWeight: fontWeight.medium
        }),
        flexShrink: 0,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        transition: "color 360ms ease"
      },
      icon: {
        ...useIconWrapper(24),
        ...hacks.backfaceVisibilityFix,
        color: coloring.text,
        transition: "color 360ms ease",
        ...(direction === "rtl"
          ? { marginRight: pxToRem(-4), marginLeft: pxToRem(8) }
          : { marginLeft: pxToRem(-4), marginRight: pxToRem(8) })
      },
      iconButton: {
        "& $icon": { marginRight: "0 !important", marginLeft: "0 !important" }
      },
      largeIconButton: {
        width: pxToRem(56),
        height: pxToRem(56),
        padding: pxToRem(16),
        "& $icon": useIconWrapper(24)
      },
      mediumIconButton: {
        width: pxToRem(48),
        height: pxToRem(48),
        padding: pxToRem(12),
        "& $icon": useIconWrapper(24)
      },
      smallIconButton: {
        width: pxToRem(40),
        height: pxToRem(40),
        padding: pxToRem(10),
        "& $icon": useIconWrapper(20)
      },
      disabled: {
        backgroundColor: !darkMode
          ? colors.pallete.grey[100]
          : colors.pallete.grey[900],
        "& $label": {
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.32 })
            : colors.createWhiteColor({ alpha: 0.12 })
        },
        "& $icon": {
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.32 })
            : colors.createWhiteColor({ alpha: 0.12 })
        },
        boxShadow: "none !important",
        pointerEvents: "none",
        "&:hover, &:focus": {
          backgroundColor: !darkMode
            ? colors.pallete.grey[100]
            : colors.pallete.grey[900],
          boxShadow: "none !important",
          transform: "none !important"
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const FloatingActionButton = React.memo(
  React.forwardRef(function FloatingActionButton(props, ref) {
    const {
      leadingIcon,
      label,
      className,
      rootNode: RootNode = "button",
      iconButtonSize = "large",
      disabled = false,
      ...otherProps
    } = props;

    const localClass = useStyles();

    const isLabeled = label != null;
    const isIconed = leadingIcon != null;
    const isInvalid = !isLabeled && !isIconed;
    const isIconButton = !isInvalid && !isLabeled && isIconed;

    const isNative = RootNode === "button";

    const conditionalProps = {};

    if (isNative) {
      conditionalProps.disabled = disabled;
    } else {
      conditionalProps["aria-disabled"] = disabled;
      conditionalProps.role = "button";
    }

    const iconComponents = { leading: null, single: null };

    if (isIconButton) {
      iconComponents.single = (
        <i className={createClass(localClass.leadingIcon, localClass.icon)}>
          {leadingIcon}
        </i>
      );
    } else if (isIconed) {
      iconComponents.leading = (
        <i className={createClass(localClass.leadingIcon, localClass.icon)}>
          {leadingIcon}
        </i>
      );
    }

    return isInvalid ? null : (
      <RootNode
        ref={ref}
        type="button"
        tabIndex={disabled ? -1 : 0}
        className={createClass(localClass.root, className, {
          [localClass.iconButton]: isIconButton,
          [localClass.disabled]: disabled,
          [localClass[`${iconButtonSize}IconButton`]]:
            isIconButton && allowedIconButtonSizes.includes(iconButtonSize)
        })}
        {...conditionalProps}
        {...otherProps}
      >
        {iconComponents.leading}
        {!isIconButton ? (
          <span className={localClass.label}>{label}</span>
        ) : (
          iconComponents.single
        )}
      </RootNode>
    );
  })
);

FloatingActionButton.displayName = componentName;

FloatingActionButton.propTypes = {
  rootNode: PropTypes.elementType,
  className: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  leadingIcon: PropTypes.node,
  iconButtonSize: PropTypes.oneOf(allowedIconButtonSizes)
};

export default FloatingActionButton;
