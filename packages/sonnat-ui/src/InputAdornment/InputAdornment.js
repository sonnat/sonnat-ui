import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import useInputBase from "../InputBase/useInputBase";
import { adjustColor } from "../styles/colorUtils";
import makeStyles from "../styles/makeStyles";
import getVar from "../utils/getVar";

const componentName = "InputAdornment";

const allowedVariants = ["node", "icon", "text"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { useIconWrapper },
      typography: { pxToRem, useText, fontWeight, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        transition: "color 180ms ease"
      },
      nodeAdornment: {
        display: "inline-flex",
        alignItems: "center"
      },
      iconAdornment: {
        color: colors.text.hint
      },
      textAdornment: {
        ...useText({ color: colors.text.hint }),
        display: "inline-flex",
        justifyContent: "center",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
      },
      actionable: {
        border: "none",
        outline: "none",
        padding: 0,
        backgroundColor: colors.transparent,
        cursor: "pointer",
        "&:hover, &:focus": {
          color: !darkMode
            ? adjustColor(colors.text.secondary, { lightness: 12 })
            : colors.createWhiteColor({ alpha: 0.98 })
        },
        "&:active": {
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.6 })
            : colors.createWhiteColor({ alpha: 0.5 })
        }
      },
      disabled: {
        "&$textAdornment": { color: colors.text.hint },
        "&$iconAdornment": { color: colors.divider }
      },
      large: {
        "&$textAdornment": {
          minWidth: pxToRem(24),
          fontSize: pxToRem(14),
          lineHeight: 1.5714285714
        },
        "&$iconAdornment": useIconWrapper(24),
        "& + *": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(8) }
            : { marginLeft: pxToRem(8) })
        }
      },
      medium: {
        "&$textAdornment": {
          minWidth: pxToRem(16),
          fontSize: pxToRem(10),
          fontWeight: fontWeight.medium,
          lineHeight: 1.8
        },
        "&$iconAdornment": useIconWrapper(16),
        "& + *": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(4) }
            : { marginLeft: pxToRem(4) })
        }
      },
      small: {
        "&$textAdornment": {
          minWidth: pxToRem(16),
          fontSize: pxToRem(10),
          fontWeight: fontWeight.medium,
          lineHeight: 1.8
        },
        "&$iconAdornment": useIconWrapper(14),
        "& + *": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(4) }
            : { marginLeft: pxToRem(4) })
        }
      },
      errored: {
        "&:not($disabled)$iconAdornment": {
          color: !darkMode ? colors.error.origin : colors.error.light
        },
        "&:not($disabled)$textAdornment": {
          color: !darkMode ? colors.error.origin : colors.error.light
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const InputAdornment = React.memo(
  React.forwardRef(function InputAdornment(props, ref) {
    const {
      className,
      children,
      variant: variantProp = "node",
      ...otherProps
    } = props;

    const classes = useStyles();

    const variant = getVar(
      variantProp,
      "node",
      !allowedVariants.includes(variantProp)
    );

    const RootNode = variant === "icon" ? "i" : "div";

    const { size, disabled, hasError } = useInputBase();

    return (
      <RootNode
        ref={ref}
        role={otherProps.onClick ? "button" : undefined}
        tabIndex={otherProps.onClick ? (disabled ? -1 : 0) : undefined}
        className={clx(
          classes.root,
          className,
          classes[size],
          classes[`${variant}Adornment`],
          {
            [classes.actionable]: !!otherProps.onClick,
            [classes.disabled]: disabled,
            [classes.errored]: hasError
          }
        )}
        {...otherProps}
      >
        {children}
      </RootNode>
    );
  })
);

InputAdornment.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(allowedVariants)
};

InputAdornment.displayName = componentName;

export default InputAdornment;
