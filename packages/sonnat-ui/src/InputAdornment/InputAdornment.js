import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import useInputBase from "../InputBase/useInputBase";
import { adjustColor } from "../styles/colorUtils";
import makeStyles from "../styles/makeStyles";
import { blue } from "../styles/pallete";
import getVar from "../utils/getVar";
import useEventCallback from "../utils/useEventCallback";
import useForkRef from "../utils/useForkRef";
import useIsFocusVisible from "../utils/useIsFocusVisible";

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
        "&:hover": {
          color: !darkMode
            ? adjustColor(colors.text.secondary, { lightness: 12 })
            : colors.createWhiteColor({ alpha: 0.98 }),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
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
      },
      focusVisible: {
        outline: `2px solid ${darkMode ? blue[300] : blue[500]}`,
        outlineOffset: 1
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const InputAdornment = React.forwardRef(function InputAdornment(props, ref) {
  const {
    className,
    children,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onClick,
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

  const isActionable = onClick != null;

  const { size, disabled, hasError } = useInputBase();

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();

  const adornmentRef = React.useRef(null);

  const handleOwnRef = useForkRef(focusVisibleRef, adornmentRef);
  const handleRef = useForkRef(ref, handleOwnRef);

  const [focusVisible, setFocusVisible] = React.useState(false);

  if (disabled && focusVisible) {
    setFocusVisible(false);
  }

  React.useEffect(() => {
    isFocusVisibleRef.current = focusVisible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusVisible]);

  const handleFocus = useEventCallback(event => {
    // Fix for https://github.com/facebook/react/issues/7769
    if (!adornmentRef.current) adornmentRef.current = event.currentTarget;

    handleFocusVisible(event);

    if (isFocusVisibleRef.current === true) setFocusVisible(true);
    if (onFocus) onFocus(event);
  });

  const handleBlur = useEventCallback(event => {
    handleBlurVisible(event);

    if (isFocusVisibleRef.current === false) setFocusVisible(false);
    if (onBlur) onBlur(event);
  });

  const keyDownRef = React.useRef(false);

  const handleKeyDown = useEventCallback(event => {
    if (keyDownRef.current === false && focusVisible && event.key === " ") {
      keyDownRef.current = true;
    }

    if (event.target === event.currentTarget && event.key === " ") {
      event.preventDefault();
    }

    if (onKeyDown) onKeyDown(event);

    // Keyboard accessibility for non interactive elements
    if (
      event.target === event.currentTarget &&
      event.key.toLowerCase() === "enter" &&
      !disabled
    ) {
      event.preventDefault();
      if (onClick) onClick(event);
    }
  });

  const handleKeyUp = useEventCallback(event => {
    if (!event.defaultPrevented && focusVisible && event.key === " ") {
      keyDownRef.current = false;
    }

    if (onKeyUp) onKeyUp(event);

    // Keyboard accessibility for non interactive elements
    if (
      event.target === event.currentTarget &&
      event.key === " " &&
      !event.defaultPrevented
    ) {
      if (onClick) onClick(event);
    }
  });

  const actionProps = isActionable
    ? {
        onClick,
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
        onFocus: handleFocus,
        onBlur: handleBlur
      }
    : {};

  return (
    <RootNode
      ref={handleRef}
      role={isActionable ? "button" : undefined}
      tabIndex={isActionable ? (disabled ? -1 : 0) : undefined}
      className={clx(
        classes.root,
        className,
        classes[size],
        classes[`${variant}Adornment`],
        {
          [classes.focusVisible]: focusVisible,
          [classes.actionable]: isActionable,
          [classes.disabled]: disabled,
          [classes.errored]: hasError
        }
      )}
      {...actionProps}
      {...otherProps}
    >
      {children}
    </RootNode>
  );
});

InputAdornment.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(allowedVariants),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onClick: PropTypes.func
};

InputAdornment.displayName = componentName;

export default InputAdornment;
