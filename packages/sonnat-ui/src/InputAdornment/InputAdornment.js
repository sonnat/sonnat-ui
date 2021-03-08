import React, { useRef } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import useInputBase from "../InputBase/useInputBase";
import makeStyles from "../styles/makeStyles";
import { adjustColor } from "../styles/colorUtils";

const componentName = "InputAdornment";
const allowedVariants = ["node", "icon", "text"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { useFontIconSize },
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
      medium: {
        "&$textAdornment": { minWidth: pxToRem(24), fontSize: pxToRem(14) },
        "&$iconAdornment": { "& > *": useFontIconSize(24) },
        "& + *": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(8) }
            : { marginLeft: pxToRem(8) })
        }
      },
      small: {
        "&$textAdornment": {
          minWidth: pxToRem(16),
          fontSize: pxToRem(10),
          fontWeight: fontWeight.medium
        },
        "&$iconAdornment": { "& > *": useFontIconSize(16) },
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
    const { className, children, variant = "node", ...otherProps } = props;

    const localClass = useStyles();

    const { size, disabled, hasError } = useInputBase();

    const { current: hasValidVariant } = useRef(
      allowedVariants.includes(variant)
    );

    return hasValidVariant ? (
      <div
        ref={ref}
        role={otherProps.onClick ? "button" : undefined}
        tabIndex={otherProps.onClick ? "0" : undefined}
        className={createClass(
          localClass.root,
          className,
          localClass[size],
          localClass[`${variant}Adornment`],
          {
            [localClass.actionable]: !!otherProps.onClick,
            [localClass.disabled]: disabled,
            [localClass.errored]: hasError
          }
        )}
        {...otherProps}
      >
        {children}
      </div>
    ) : null;
  })
);

InputAdornment.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(allowedVariants)
};

InputAdornment.displayName = componentName;

export default InputAdornment;
