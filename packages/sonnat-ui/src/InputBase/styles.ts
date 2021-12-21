import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      palette: { blue },
      typography: { pxToRem, setText, fontFamily }
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
          "&$filled:hover $notchedOutline": {
            border: "none",
            backgroundColor: darkMode
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.08)"
          },
          "&$outlined:hover $notchedOutline": {
            borderColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.48 })
              : colors.createWhiteColor({ alpha: 0.48 })
          }
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
        ...setText({ color: colors.text.secondary }),
        ...(direction === "rtl"
          ? { transformOrigin: "top right" }
          : { transformOrigin: "top left" }),
        zIndex: "1",
        pointerEvents: "none",
        transition:
          "color 180ms ease, transform 180ms ease, font-size 180ms ease",
        position: "absolute"
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
        "& $notchedOutline": { borderColor: colors.divider },
        "& $label": { color: colors.text.hint }
      },
      focused: {
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
        }
      },
      withTrailingAdornment: {},
      multipleSelect: { "& $control": { overflow: "visible" } }
    };
  },
  { name: "SonnatInputBase" }
);

export default useStyles;
