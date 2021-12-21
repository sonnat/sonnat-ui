import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      palette: { blue },
      mixins: { asIconWrapper },
      typography: { pxToRem, setText, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        "&:not($errored):not($focused):hover $wrapper:after": {
          borderColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.48 })
            : colors.createWhiteColor({ alpha: 0.48 })
        }
      },
      wrapper: {
        display: "inline-flex",
        position: "relative",
        minWidth: "0",
        verticalAlign: "top",
        flexDirection: "column",
        "&:after": {
          content: "''",
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
          borderRadius: pxToRem(4),
          pointerEvents: "none"
        }
      },
      shadow: {
        ...setText({ color: colors.text.primary }),
        visibility: "hidden",

        // Remove from the content flow
        position: "absolute",

        // Ignore the scrollbar width
        overflow: "hidden",

        border: "none",
        top: 0,
        left: 0,
        height: 0,
        padding: [[pxToRem(8), pxToRem(16)]],

        // Create a new layer, increase the isolation of the computed values
        transform: "translateZ(0)"
      },
      input: {
        ...setText({ color: colors.text.primary }),
        minWidth: 0,
        outline: "none",
        border: "none",
        backgroundColor: colors.transparent,
        resize: "none",
        padding: [[pxToRem(8), pxToRem(16)]],
        borderRadius: pxToRem(4),
        boxShadow: `0 0 0 0 ${colors.transparent}`,
        appearance: "none !important",
        "&::-webkit-input-placeholder": { color: colors.text.hint },
        "&::-moz-placeholder": { color: colors.text.hint },
        "&:-ms-input-placeholder": { color: colors.text.hint },
        "&:-moz-placeholder": { color: colors.text.hint }
      },
      helperRow: {
        display: "flex",
        marginTop: pxToRem(4),
        padding: [[0, pxToRem(8)]]
      },
      helperContent: {
        display: "flex",
        margin: 0,
        flex: [[1, 0]],
        "& + $charCount": {
          ...(direction === "rtl"
            ? { paddingRight: pxToRem(8) }
            : { paddingLeft: pxToRem(8) })
        }
      },
      helperText: {
        ...setText({
          fontSize: pxToRem(12),
          lineHeight: 1.6666666667,
          color: colors.text.secondary
        })
      },
      helperIcon: {
        ...asIconWrapper(16),
        marginTop: pxToRem(2),
        color: colors.text.secondary,
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) })
      },
      charCount: {
        ...setText({
          fontSize: pxToRem(12),
          lineHeight: 1.6666666667,
          color: colors.text.secondary
        }),
        ...(direction === "rtl"
          ? { marginRight: "auto" }
          : { marginLeft: "auto" }),
        minWidth: "7.7ch",
        display: "flex",
        justifyContent: "flex-end",
        flexShrink: 0
      },
      fluid: { width: "100%", "& $wrapper": { width: "100%" } },
      errored: {
        "& $wrapper:after": {
          borderColor: !darkMode ? colors.error.origin : colors.error.light
        },
        "&:not($disabled)": {
          "& $charCount": {
            color: !darkMode ? colors.error.origin : colors.error.light
          },
          "& $helperText": {
            color: !darkMode ? colors.error.origin : colors.error.light
          },
          "& $helperIcon": {
            color: !darkMode ? colors.error.origin : colors.error.light
          }
        }
      },
      readOnly: {
        pointerEvents: "none",
        "& $input": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 })
        }
      },
      disabled: {
        pointerEvents: "none",
        "& $wrapper:after": { borderColor: colors.divider },
        "& $input": {
          color: colors.text.disabled,
          "&::-webkit-input-placeholder": { color: colors.text.disabled },
          "&::-moz-placeholder": { color: colors.text.disabled },
          "&:-ms-input-placeholder": { color: colors.text.disabled },
          "&:-moz-placeholder": { color: colors.text.disabled }
        }
      },
      focused: {
        "&:not($errored) $wrapper:after": {
          borderWidth: 2,
          borderColor: !darkMode ? blue[500] : blue[300]
        },
        "&$errored $wrapper:after": {
          borderWidth: 2,
          borderColor: !darkMode ? colors.error.origin : colors.error.light
        }
      },
      small: {
        "& $helperText": {
          fontSize: pxToRem(10),
          lineHeight: 1.8
        },
        "& $helperIcon": {
          ...asIconWrapper(14)
        },
        "& $input, & $shadow": {
          padding: [[pxToRem(2), pxToRem(8)]],
          fontSize: pxToRem(12),
          lineHeight: 1.6666666667,
          "&::-webkit-input-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          },
          "&::-moz-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          },
          "&:-ms-input-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          },
          "&:-moz-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          }
        }
      },
      medium: {
        "& $input, & $shadow": {
          padding: [[pxToRem(6), pxToRem(8)]],
          fontSize: pxToRem(12),
          lineHeight: 1.6666666667,
          "&::-webkit-input-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          },
          "&::-moz-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          },
          "&:-ms-input-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          },
          "&:-moz-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          }
        }
      },
      large: {},
      resizable: { "& $input": { resize: "vertical" } }
    };
  },
  { name: "SonnatTextArea" }
);

export default useStyles;
