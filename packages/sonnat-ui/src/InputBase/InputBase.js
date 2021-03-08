import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import useTextField from "../TextField/useTextField";
import TextInputBaseContext from "./context";
import makeStyles from "../styles/makeStyles";
import { changeColor } from "../styles/colorUtils";

const componentName = "InputBase";
const allowedVariants = ["filled", "outlined"];
const allowedSizes = ["medium", "small"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "inline-flex",
        position: "relative",
        minWidth: "0",
        verticalAlign: "top",
        flexDirection: "column",
        "&:not($focused):not($errored):hover": {
          "& $notchedOutline": {
            borderColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.48 })
              : colors.createWhiteColor({ alpha: 0.48 })
          }
        },
        "&:not($empty)": {
          "&$medium $label": {
            ...(direction === "rtl"
              ? {
                  transform: `translate(${pxToRem(-1)}, ${pxToRem(
                    -16
                  )}) scale(0.75)`
                }
              : {
                  transform: `translate(${pxToRem(1)}, ${pxToRem(
                    -16
                  )}) scale(0.75)`
                })
          },
          "&$small $label": {
            ...(direction === "rtl"
              ? { transform: `translate(${pxToRem(-5)}, ${pxToRem(-16)})` }
              : { transform: `translate(${pxToRem(5)}, ${pxToRem(-16)})` })
          },
          "& $legendLabel": {
            maxWidth: "999px"
          }
        }
      },
      control: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        minHeight: "100%",
        position: "relative"
      },
      label: {
        ...useText({ color: colors.text.secondary }),
        ...(direction === "rtl"
          ? { transformOrigin: "top right" }
          : { transformOrigin: "top left" }),
        zIndex: "1",
        pointerEvents: "none",
        transition:
          "color 180ms ease, transform 180ms ease, font-size 180ms ease",
        position: "absolute"
      },
      legendLabel: {
        visibility: "hidden",
        maxWidth: 0,
        display: "block",
        whiteSpace: "nowrap",
        transition: "max-width 50ms ease 0ms"
      },
      legendLabelText: {
        ...useText({
          fontSize: pxToRem(12),
          color: colors.text.secondary
        }),
        display: "inline-block",
        paddingLeft: pxToRem(4),
        paddingRight: pxToRem(4)
      },
      wrapper: {
        display: "flex",
        flex: [[1, 0]],
        minWidth: 0,
        position: "relative",
        alignItems: "center",
        borderRadius: pxToRem(4)
      },
      notchedOutline: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "absolute",
        borderStyle: "solid",
        borderWidth: pxToRem(1),
        borderColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.24 })
          : colors.createWhiteColor({ alpha: 0.24 }),
        borderRadius: "inherit",
        pointerEvents: "none"
      },
      adornment: {
        display: "flex",
        whiteSpace: "nowrap",
        alignItems: "center",
        height: "100%"
      },
      leadingAdornment: {
        extend: "adornment"
      },
      trailingAdornment: {
        extend: "adornment"
      },
      fluid: { width: "100%" },
      readOnly: {
        pointerEvents: "none",
        "& $wrapper": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 })
        }
      },
      disabled: {
        pointerEvents: "none",
        "& $notchedOutline": {
          borderColor: colors.divider
        },
        "& $label": { color: colors.text.hint }
      },
      focused: {
        "& $legendLabel": {
          maxWidth: "999px",
          transition: "max-width 100ms ease 50ms"
        },
        "&:not($errored) $notchedOutline": {
          borderColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.56 })
            : changeColor(colors.primary.light, { alpha: 0.56 })
        },
        "& $notchedOutline": {
          borderWidth: pxToRem(2)
        },
        "&:not($errored) $label": {
          color: !darkMode ? colors.primary.origin : colors.primary.light
        },
        "&$medium $label": {
          ...(direction === "rtl"
            ? {
                transform: `translate(${pxToRem(-1)}, ${pxToRem(
                  -16
                )}) scale(0.75)`
              }
            : {
                transform: `translate(${pxToRem(1)}, ${pxToRem(
                  -16
                )}) scale(0.75)`
              })
        },
        "&$small $label": {
          ...(direction === "rtl"
            ? { transform: `translate(${pxToRem(-5)}, ${pxToRem(-16)})` }
            : { transform: `translate(${pxToRem(5)}, ${pxToRem(-16)})` })
        }
      },
      small: {
        "& $wrapper": { minHeight: pxToRem(32) },
        "& $label": { fontSize: pxToRem(12) },
        "&:not($rounded)": {
          "& $leadingAdornment": {
            ...(direction === "rtl"
              ? { marginRight: pxToRem(0) }
              : { marginLeft: pxToRem(0) })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl"
              ? { marginLeft: pxToRem(0) }
              : { marginRight: pxToRem(0) })
          },
          "& $wrapper": { padding: [[0, pxToRem(8)]] },
          "& $notchedOutline": { padding: [[0, pxToRem(8)]] }
        },
        "& $leadingAdornment + $control": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(4) }
            : { marginLeft: pxToRem(4) })
        },
        "& $control + $trailingAdornment": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(4) }
            : { marginLeft: pxToRem(4) })
        }
      },
      medium: {
        "&:not($rounded)": {
          "& $leadingAdornment": {
            ...(direction === "rtl"
              ? { marginRight: pxToRem(-8) }
              : { marginLeft: pxToRem(-8) })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl"
              ? { marginLeft: pxToRem(-8) }
              : { marginRight: pxToRem(-8) })
          },
          "& $wrapper": { padding: [[0, pxToRem(16)]] },
          "& $notchedOutline": { padding: [[0, pxToRem(12)]] }
        },
        "& $wrapper": { minHeight: pxToRem(40) },
        "& $leadingAdornment + $control": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(8) }
            : { marginLeft: pxToRem(8) })
        },
        "& $control + $trailingAdornment": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(8) }
            : { marginLeft: pxToRem(8) })
        }
      },
      legendLabeled: {
        "& $notchedOutline": { top: pxToRem(-12) }
      },
      rounded: {
        "&$medium": {
          "& $wrapper": {
            borderRadius: pxToRem(20),
            padding: [[0, pxToRem(24)]]
          },
          "& $notchedOutline": { padding: [[0, pxToRem(20)]] },
          "& $leadingAdornment": {
            ...(direction === "rtl"
              ? { marginRight: pxToRem(-12) }
              : { marginLeft: pxToRem(-12) })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl"
              ? { marginLeft: pxToRem(-12) }
              : { marginRight: pxToRem(-12) })
          }
        },
        "&$small": {
          "& $wrapper": {
            borderRadius: pxToRem(16),
            padding: [[0, pxToRem(16)]]
          },
          "& $notchedOutline": { padding: [[0, pxToRem(16)]] },
          "& $leadingAdornment": {
            ...(direction === "rtl"
              ? { marginRight: pxToRem(-4) }
              : { marginLeft: pxToRem(-4) })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl"
              ? { marginLeft: pxToRem(-4) }
              : { marginRight: pxToRem(-4) })
          }
        }
      },
      errored: {
        "&:not($disabled)": {
          "& $notchedOutline": {
            borderColor: !darkMode ? colors.error.origin : colors.error.light
          },
          "& $label": {
            color: !darkMode ? colors.error.origin : colors.error.light
          }
        }
      },
      outlined: {},
      filled: {
        "& $notchedOutline": { border: "none" }
      },
      empty: {},
      withLeadingAdornment: {
        "&$medium $label": {
          ...(direction === "rtl"
            ? {
                transform: `translate(${pxToRem(-1)}, ${pxToRem(
                  -16
                )}) scale(0.75)`
              }
            : {
                transform: `translate(${pxToRem(1)}, ${pxToRem(
                  -16
                )}) scale(0.75)`
              })
        },
        "&$small $label": {
          ...(direction === "rtl"
            ? { transform: `translate(${pxToRem(-5)}, ${pxToRem(-16)})` }
            : { transform: `translate(${pxToRem(5)}, ${pxToRem(-16)})` })
        },
        "& $legendLabel": {
          maxWidth: "999px"
        }
      },
      withTrailingAdornment: {}
    };
  },
  { name: `Sonnat${componentName}` }
);

const InputBase = React.memo(
  React.forwardRef(function InputBase(props, ref) {
    const {
      children,
      controller,
      className,
      legendLabel,
      leadingAdornment,
      trailingAdornment,
      controllerId,
      variant = "outlined",
      size = "medium",
      focused = false,
      readOnly = false,
      disabled = false,
      fluid = false,
      rounded = false,
      hasError = false,
      ...otherProps
    } = props;

    const localClass = useStyles();
    const { isEmpty } = useTextField();

    const isLegendLabeled = !!legendLabel;
    const hasLeadingAdornment = !!leadingAdornment;
    const hasTrailingAdornment = !!trailingAdornment;

    return (
      <TextInputBaseContext.Provider value={{ size, disabled, hasError }}>
        <div
          ref={ref}
          className={createClass(localClass.root, className, {
            [localClass.empty]: isEmpty,
            [localClass.fluid]: fluid,
            [localClass.disabled]: disabled,
            [localClass.readOnly]: readOnly,
            [localClass.focused]: focused,
            [localClass.withLeadingAdornment]: hasLeadingAdornment,
            [localClass.withTrailingAdornment]: hasTrailingAdornment,
            [localClass[variant]]: allowedVariants.includes(variant),
            [localClass[size]]: allowedSizes.includes(size),
            [localClass.rounded]: rounded,
            [localClass.errored]: hasError,
            [localClass.legendLabeled]: isLegendLabeled
          })}
          {...otherProps}
        >
          <div className={localClass.wrapper}>
            {legendLabel && (
              <label className={localClass.label} htmlFor={controllerId}>
                {legendLabel}
              </label>
            )}
            {leadingAdornment && (
              <div className={localClass.leadingAdornment}>
                {leadingAdornment}
              </div>
            )}
            <div className={localClass.control}>{controller}</div>
            {trailingAdornment && (
              <div className={localClass.trailingAdornment}>
                {trailingAdornment}
              </div>
            )}
            <fieldset aria-hidden={true} className={localClass.notchedOutline}>
              {legendLabel && (
                <legend className={localClass.legendLabel}>
                  <span className={localClass.legendLabelText}>
                    {legendLabel}
                  </span>
                </legend>
              )}
            </fieldset>
          </div>
        </div>
        {children}
      </TextInputBaseContext.Provider>
    );
  })
);

InputBase.propTypes = {
  children: PropTypes.node,
  controller: PropTypes.node,
  controllerId: PropTypes.string,
  className: PropTypes.string,
  legendLabel: PropTypes.string,
  leadingAdornment: PropTypes.node,
  trailingAdornment: PropTypes.node,
  focused: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  hasError: PropTypes.bool,
  fluid: PropTypes.bool,
  size: PropTypes.oneOf(allowedSizes),
  variant: PropTypes.oneOf(allowedVariants)
};

InputBase.displayName = componentName;

export default InputBase;
