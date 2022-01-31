import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      radius,
      spacings: { spaces },
      swatches: { blue },
      typography: { pxToRem, fontFamily }
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
              ? colors.createBlackColor({ alpha: 0.48 }, true, darkMode)
              : colors.createWhiteColor({ alpha: 0.48 }, true, darkMode)
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
      wrapper: {
        display: "flex",
        flex: [[1, 0]],
        minWidth: 0,
        position: "relative",
        alignItems: "center",
        borderRadius: radius.small
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
          ? colors.createBlackColor({ alpha: 0.24 }, true, darkMode)
          : colors.createWhiteColor({ alpha: 0.24 }, true, darkMode),
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
            ? colors.createBlackColor({ alpha: 0.04 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.04 }, false, darkMode)
        }
      },
      disabled: {
        pointerEvents: "none",
        "& $notchedOutline": {
          borderColor: !darkMode ? colors.divider.dark : colors.divider.light
        }
      },
      focused: {
        "&:not($errored) $notchedOutline": {
          borderColor: !darkMode ? blue[500] : blue[600]
        },
        "& $notchedOutline": { borderWidth: `${pxToRem(2)} !important` }
      },
      small: {
        "& $wrapper": { minHeight: pxToRem(24) },
        "&$rounded": {
          "& $wrapper": {
            borderRadius: radius.rounded,
            padding: [[0, spaces[4].rem]]
          },
          "& $notchedOutline": { padding: [[0, spaces[4].rem]] },
          "& $leadingAdornment": {
            ...(direction === "rtl"
              ? { marginRight: pxToRem(spaces[2].px - spaces[4].px) }
              : { marginLeft: pxToRem(spaces[2].px - spaces[4].px) })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl"
              ? { marginLeft: pxToRem(spaces[2].px - spaces[4].px) }
              : { marginRight: pxToRem(spaces[2].px - spaces[4].px) })
          }
        },
        "&:not($rounded)": {
          "& $wrapper": { padding: [[0, spaces[3].rem]] },
          "& $notchedOutline": { padding: [[0, spaces[3].rem]] },
          "& $leadingAdornment": {
            ...(direction === "rtl" ? { marginRight: 0 } : { marginLeft: 0 })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl" ? { marginLeft: 0 } : { marginRight: 0 })
          }
        },
        "& $leadingAdornment + $control": {
          ...(direction === "rtl"
            ? { marginRight: spaces[1].rem }
            : { marginLeft: spaces[1].rem })
        },
        "& $control + $trailingAdornment": {
          ...(direction === "rtl"
            ? { marginRight: spaces[1].rem }
            : { marginLeft: spaces[1].rem })
        }
      },
      medium: {
        "& $wrapper": { minHeight: pxToRem(32) },
        "&$rounded": {
          "& $wrapper": {
            borderRadius: radius.rounded,
            padding: [[0, spaces[7].rem]]
          },
          "& $notchedOutline": { padding: [[0, spaces[7].rem]] },
          "& $leadingAdornment": {
            ...(direction === "rtl"
              ? { marginRight: pxToRem(spaces[5].px - spaces[7].px) }
              : { marginLeft: pxToRem(spaces[5].px - spaces[7].px) })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl"
              ? { marginLeft: pxToRem(spaces[5].px - spaces[7].px) }
              : { marginRight: pxToRem(spaces[5].px - spaces[7].px) })
          }
        },
        "&:not($rounded)": {
          "& $wrapper": { padding: [[0, spaces[3].rem]] },
          "& $notchedOutline": { padding: [[0, spaces[3].rem]] },
          "& $leadingAdornment": {
            ...(direction === "rtl" ? { marginRight: 0 } : { marginLeft: 0 })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl" ? { marginLeft: 0 } : { marginRight: 0 })
          }
        },
        "& $leadingAdornment + $control": {
          ...(direction === "rtl"
            ? { marginRight: spaces[1].rem }
            : { marginLeft: spaces[1].rem })
        },
        "& $control + $trailingAdornment": {
          ...(direction === "rtl"
            ? { marginRight: spaces[1].rem }
            : { marginLeft: spaces[1].rem })
        }
      },
      large: {
        "& $wrapper": { minHeight: pxToRem(40) },
        "&$rounded": {
          "& $wrapper": {
            borderRadius: radius.rounded,
            padding: [[0, spaces[10].rem]]
          },
          "& $notchedOutline": { padding: [[0, spaces[10].rem]] },
          "& $leadingAdornment": {
            ...(direction === "rtl"
              ? { marginRight: pxToRem(spaces[5].px - spaces[10].px) }
              : { marginLeft: pxToRem(spaces[5].px - spaces[10].px) })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl"
              ? { marginLeft: pxToRem(spaces[5].px - spaces[10].px) }
              : { marginRight: pxToRem(spaces[5].px - spaces[10].px) })
          }
        },
        "&:not($rounded)": {
          "& $wrapper": { padding: [[0, spaces[7].rem]] },
          "& $notchedOutline": { padding: [[0, spaces[7].rem]] },
          "& $leadingAdornment": {
            ...(direction === "rtl"
              ? { marginRight: pxToRem(spaces[3].px - spaces[7].px) }
              : { marginLeft: pxToRem(spaces[3].px - spaces[7].px) })
          },
          "& $trailingAdornment": {
            ...(direction === "rtl"
              ? { marginLeft: pxToRem(spaces[3].px - spaces[7].px) }
              : { marginRight: pxToRem(spaces[3].px - spaces[7].px) })
          }
        },
        "& $leadingAdornment + $control": {
          ...(direction === "rtl"
            ? { marginRight: spaces[3].rem }
            : { marginLeft: spaces[3].rem })
        },
        "& $control + $trailingAdornment": {
          ...(direction === "rtl"
            ? { marginRight: spaces[3].rem }
            : { marginLeft: spaces[3].rem })
        }
      },
      rounded: {},
      errored: {
        "&:not($disabled) $notchedOutline": {
          borderColor: !darkMode ? colors.error.origin : colors.error.light
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
      withLeadingAdornment: {},
      withTrailingAdornment: {},
      multipleSelect: { "& $control": { overflow: "visible" } }
    };
  },
  { name: "SonnatInputBase" }
);

export default useStyles;
