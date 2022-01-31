import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      direction,
      spacings: { spaces },
      colors: { text, error, transparent },
      mixins: { asIconWrapper },
      typography: { pxToRem, variants, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "inline-flex",
        position: "relative",
        flexDirection: "column"
      },
      base: { cursor: "text" },
      input: {
        ...variants.body,
        color: !darkMode ? text.dark.primary : text.light.primary,
        border: "none",
        outline: "none",
        padding: 0,
        margin: 0,
        flex: [[1, 1]],
        minWidth: 0,
        height: pxToRem(40),
        appearance: "none !important",
        backgroundColor: transparent,
        "&::-webkit-input-placeholder": {
          ...variants.body,
          color: !darkMode ? text.dark.hint : text.light.hint
        },
        "&::-moz-placeholder": {
          ...variants.body,
          color: !darkMode ? text.dark.hint : text.light.hint
        },
        "&:-ms-input-placeholder": {
          ...variants.body,
          color: !darkMode ? text.dark.hint : text.light.hint
        },
        "&:-moz-placeholder": {
          ...variants.body,
          color: !darkMode ? text.dark.hint : text.light.hint
        }
      },
      helperRow: {
        display: "flex",
        marginTop: spaces[1].rem,
        padding: [[0, spaces[3].rem]]
      },
      helperContent: {
        display: "flex",
        margin: 0,
        flex: [[1, 0]],
        "& + $charCount": {
          ...(direction === "rtl"
            ? { paddingRight: spaces[3].rem }
            : { paddingLeft: spaces[3].rem })
        }
      },
      helperText: {
        ...variants.caption,
        color: !darkMode ? text.dark.secondary : text.light.secondary
      },
      helperIcon: {
        ...asIconWrapper(16),
        marginTop: spaces[0].rem,
        color: !darkMode ? text.dark.secondary : text.light.secondary,
        ...(direction === "rtl"
          ? { marginLeft: spaces[1].rem }
          : { marginRight: spaces[1].rem })
      },
      charCount: {
        ...variants.caption,
        ...(direction === "rtl"
          ? { marginRight: "auto" }
          : { marginLeft: "auto" }),
        color: !darkMode ? text.dark.secondary : text.light.secondary,
        minWidth: "7.7ch",
        display: "flex",
        justifyContent: "flex-end",
        flexShrink: 0
      },
      disabled: {
        pointerEvents: "none",
        "& $input": {
          color: !darkMode ? text.dark.disabled : text.light.disabled,
          "&::-webkit-input-placeholder": {
            color: !darkMode ? text.dark.disabled : text.light.disabled
          },
          "&::-moz-placeholder": {
            color: !darkMode ? text.dark.disabled : text.light.disabled
          },
          "&:-ms-input-placeholder": {
            color: !darkMode ? text.dark.disabled : text.light.disabled
          },
          "&:-moz-placeholder": {
            color: !darkMode ? text.dark.disabled : text.light.disabled
          }
        }
      },
      small: {
        "& $helperText": {
          fontSize: variants.captionSmall.fontSize,
          lineHeight: variants.captionSmall.lineHeight
        },
        "& $helperIcon": {
          ...asIconWrapper(14)
        },
        "& $input": {
          height: pxToRem(24),
          fontSize: variants.caption.fontSize,
          lineHeight: variants.caption.lineHeight,
          "&::-webkit-input-placeholder": {
            fontSize: variants.caption.fontSize,
            lineHeight: variants.caption.lineHeight
          },
          "&::-moz-placeholder": {
            fontSize: variants.caption.fontSize,
            lineHeight: variants.caption.lineHeight
          },
          "&:-ms-input-placeholder": {
            fontSize: variants.caption.fontSize,
            lineHeight: variants.caption.lineHeight
          },
          "&:-moz-placeholder": {
            fontSize: variants.caption.fontSize,
            lineHeight: variants.caption.lineHeight
          }
        }
      },
      medium: {
        "& $input": {
          height: pxToRem(32),
          fontSize: variants.caption.fontSize,
          lineHeight: variants.caption.lineHeight,
          "&::-webkit-input-placeholder": {
            fontSize: variants.caption.fontSize,
            lineHeight: variants.caption.lineHeight
          },
          "&::-moz-placeholder": {
            fontSize: variants.caption.fontSize,
            lineHeight: variants.caption.lineHeight
          },
          "&:-ms-input-placeholder": {
            fontSize: variants.caption.fontSize,
            lineHeight: variants.caption.lineHeight
          },
          "&:-moz-placeholder": {
            fontSize: variants.caption.fontSize,
            lineHeight: variants.caption.lineHeight
          }
        }
      },
      large: {},
      fluid: { width: "100%" },
      errored: {
        "&:not($disabled)": {
          "& $charCount": { color: !darkMode ? error.origin : error.light },
          "& $helperText": { color: !darkMode ? error.origin : error.light },
          "& $helperIcon": { color: !darkMode ? error.origin : error.light }
        }
      }
    };
  },
  { name: "SonnatTextField" }
);

export default useStyles;
