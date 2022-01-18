import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      spacings: { spaces },
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
        color: colors.text.primary,
        border: "none",
        outline: "none",
        padding: 0,
        margin: 0,
        flex: [[1, 1]],
        minWidth: 0,
        height: pxToRem(40),
        appearance: "none !important",
        backgroundColor: colors.transparent,
        "&::-webkit-input-placeholder": {
          ...variants.body,
          color: colors.text.hint
        },
        "&::-moz-placeholder": {
          ...variants.body,
          color: colors.text.hint
        },
        "&:-ms-input-placeholder": {
          ...variants.body,
          color: colors.text.hint
        },
        "&:-moz-placeholder": {
          ...variants.body,
          color: colors.text.hint
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
        color: colors.text.secondary
      },
      helperIcon: {
        ...asIconWrapper(16),
        marginTop: spaces[0].rem,
        color: colors.text.secondary,
        ...(direction === "rtl"
          ? { marginLeft: spaces[1].rem }
          : { marginRight: spaces[1].rem })
      },
      charCount: {
        ...variants.caption,
        ...(direction === "rtl"
          ? { marginRight: "auto" }
          : { marginLeft: "auto" }),
        color: colors.text.secondary,
        minWidth: "7.7ch",
        display: "flex",
        justifyContent: "flex-end",
        flexShrink: 0
      },
      disabled: {
        pointerEvents: "none",
        "& $input": {
          color: colors.text.disabled,
          "&::-webkit-input-placeholder": { color: colors.text.disabled },
          "&::-moz-placeholder": { color: colors.text.disabled },
          "&:-ms-input-placeholder": { color: colors.text.disabled },
          "&:-moz-placeholder": { color: colors.text.disabled }
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
      }
    };
  },
  { name: "SonnatTextField" }
);

export default useStyles;
