import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import makeStyles from "../styles/makeStyles";
import { blue } from "../styles/pallete";
import TextFieldContext from "../TextField/context";
import SelectContext from "../Select/context";
import getVar from "../utils/getVar";
import InputBaseContext from "./context";

const componentName = "InputBase";

const allowedVariants = ["filled", "outlined"];
const allowedSizes = ["large", "medium", "small"];

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
        "&:not($focused):not($errored)": {
          "&$filled:hover": {
            "& $notchedOutline": {
              border: "none",
              backgroundColor: darkMode
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.08)"
            }
          },
          "&$outlined:hover": {
            "& $notchedOutline": {
              borderColor: !darkMode
                ? colors.createBlackColor({ alpha: 0.48 })
                : colors.createWhiteColor({ alpha: 0.48 })
            }
          }
        },
        "&:not($small):not($empty) $legendLabel": {
          maxWidth: "999px"
        }
      },
      control: {
        display: "flex",
        alignItems: "center",
        flex: "1 1",
        height: "100%",
        position: "relative",
        overflow: "hidden"
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
          lineHeight: 1.6666666667,
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
        borderWidth: 1,
        borderColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.24 })
          : colors.createWhiteColor({ alpha: 0.24 }),
        borderRadius: "inherit",
        pointerEvents: "none",
        transition: "background-color 240ms ease, border-color 240ms ease"
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
        "&:not($small) $legendLabel": {
          maxWidth: "999px",
          transition: "max-width 100ms ease 50ms"
        },
        "&:not($errored) $notchedOutline": {
          borderColor: !darkMode ? blue[500] : blue[300]
        },
        "& $notchedOutline": { borderWidth: `${pxToRem(2)} !important` },
        "&:not($errored) $label": {
          color: !darkMode ? colors.primary.origin : colors.primary.light
        }
      },
      small: {
        "& $wrapper": { minHeight: pxToRem(24) },
        "&$rounded": {
          "& $wrapper": {
            borderRadius: pxToRem(12),
            padding: [[0, pxToRem(10)]]
          },
          "& $notchedOutline": { padding: [[0, pxToRem(10)]] },
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
        },
        "&:not($rounded)": {
          "& $wrapper": { padding: [[0, pxToRem(8)]] },
          "& $notchedOutline": { padding: [[0, pxToRem(8)]] },
          "& $leadingAdornment": {
            ...(direction === "rtl"
              ? { marginRight: pxToRem(0) }
              : { marginLeft: pxToRem(0) })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl"
              ? { marginLeft: pxToRem(0) }
              : { marginRight: pxToRem(0) })
          }
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
        "& $wrapper": { minHeight: pxToRem(32) },
        "& $label": { fontSize: pxToRem(12), lineHeight: 1.6666666667 },
        "& $legendLabelText": { fontSize: pxToRem(10), lineHeight: 1.8 },
        "&:not($empty) $label, &$focused $label": {
          ...(direction === "rtl"
            ? {
                transform: `translate(${pxToRem(-5)}, ${pxToRem(
                  -13
                )}) scale(0.8333333333)`
              }
            : {
                transform: `translate(${pxToRem(5)}, ${pxToRem(
                  -13
                )}) scale(0.8333333333)`
              })
        },
        "&$rounded": {
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
        },
        "&:not($rounded)": {
          "& $wrapper": { padding: [[0, pxToRem(8)]] },
          "& $notchedOutline": { padding: [[0, pxToRem(8)]] },
          "& $leadingAdornment": {
            ...(direction === "rtl"
              ? { marginRight: pxToRem(0) }
              : { marginLeft: pxToRem(0) })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl"
              ? { marginLeft: pxToRem(0) }
              : { marginRight: pxToRem(0) })
          }
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
      large: {
        "& $wrapper": { minHeight: pxToRem(40) },
        "&:not($empty) $label, &$focused $label": {
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
        "&$rounded": {
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
        "&:not($rounded)": {
          "& $wrapper": { padding: [[0, pxToRem(16)]] },
          "& $notchedOutline": { padding: [[0, pxToRem(12)]] },
          "& $leadingAdornment": {
            ...(direction === "rtl"
              ? { marginRight: pxToRem(-8) }
              : { marginLeft: pxToRem(-8) })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl"
              ? { marginLeft: pxToRem(-8) }
              : { marginRight: pxToRem(-8) })
          }
        },
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
        "& $notchedOutline": { top: pxToRem(-10) }
      },
      rounded: {},
      errored: {
        "&:not($disabled) $notchedOutline": {
          borderColor: !darkMode ? colors.error.origin : colors.error.light
        },
        "&:not($disabled) $label": {
          color: !darkMode ? colors.error.origin : colors.error.light
        },
        "&$filled:not($disabled) $notchedOutline": {
          borderWidth: 1
        }
      },
      outlined: {},
      filled: {
        "& $notchedOutline": {
          borderWidth: 0,
          backgroundColor: darkMode
            ? "rgba(255, 255, 255, 0.04)"
            : "rgba(0, 0, 0, 0.04)"
        }
      },
      empty: {},
      withLeadingAdornment: {
        "&$large $label": {
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
        "&$medium $label": {
          ...(direction === "rtl"
            ? {
                transform: `translate(${pxToRem(-5)}, ${pxToRem(
                  -13
                )}) scale(0.8333333333)`
              }
            : {
                transform: `translate(${pxToRem(5)}, ${pxToRem(
                  -13
                )}) scale(0.8333333333)`
              })
        },
        "&:not($small) $legendLabel": { maxWidth: "999px" }
      },
      withTrailingAdornment: {},
      multipleSelect: {
        "& $control": { overflow: "visible" }
      }
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
      variant: variantProp = "outlined",
      size: sizeProp = "medium",
      focused = false,
      readOnly = false,
      disabled = false,
      fluid = false,
      rounded = false,
      hasError = false,
      ...otherProps
    } = props;

    const classes = useStyles();

    const { isEmpty } = React.useContext(TextFieldContext);
    const { isMultiple } = React.useContext(SelectContext);

    const isLegendLabeled = !!legendLabel;
    const hasLeadingAdornment = !!leadingAdornment;
    const hasTrailingAdornment = !!trailingAdornment;

    const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

    const variant = getVar(
      variantProp,
      "outlined",
      !allowedVariants.includes(variantProp)
    );

    let invalidUsageOfLegend = false;

    if (isLegendLabeled && size === "small") {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(
          [
            `Sonnat: You can not use the \`size="small"\` and \`legendLabel="${legendLabel}"\` properties ` +
              "at the same time on `TextField` component.",
            `We will fallback to \`size="small"\` and \`legendLabel={undefined}\`.`
          ].join("\n")
        );
      }

      invalidUsageOfLegend = true;
    }

    return (
      <InputBaseContext.Provider value={{ size, disabled, hasError }}>
        <div
          ref={ref}
          className={clx(
            className,
            classes.root,
            classes[size],
            classes[variant],
            {
              [classes.empty]: isEmpty,
              [classes.fluid]: fluid,
              [classes.disabled]: disabled,
              [classes.readOnly]: readOnly,
              [classes.focused]: focused,
              [classes.withLeadingAdornment]: hasLeadingAdornment,
              [classes.withTrailingAdornment]: hasTrailingAdornment,
              [classes.rounded]: rounded,
              [classes.errored]: hasError,
              [classes.multipleSelect]: isMultiple,
              [classes.legendLabeled]: !invalidUsageOfLegend && isLegendLabeled
            }
          )}
          {...otherProps}
        >
          <div className={classes.wrapper}>
            {legendLabel && size !== "small" && (
              <label className={classes.label} htmlFor={controllerId}>
                {legendLabel}
              </label>
            )}
            {leadingAdornment && (
              <div className={classes.leadingAdornment}>{leadingAdornment}</div>
            )}
            <div className={classes.control}>{controller}</div>
            {trailingAdornment && (
              <div className={classes.trailingAdornment}>
                {trailingAdornment}
              </div>
            )}
            <fieldset aria-hidden={true} className={classes.notchedOutline}>
              {!invalidUsageOfLegend && legendLabel && (
                <legend className={classes.legendLabel}>
                  <span className={classes.legendLabelText}>{legendLabel}</span>
                </legend>
              )}
            </fieldset>
          </div>
        </div>
        {children}
      </InputBaseContext.Provider>
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
