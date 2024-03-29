/* eslint-disable @typescript-eslint/no-non-null-assertion */
import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      direction,
      radius,
      spacings: { spaces },
      swatches: { blue },
      mixins: { asIconWrapper },
      colors: { text, divider, ...colors },
      typography: { variants, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        display: "inline-flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: fontFamily[direction],
        "&:not($errored):not($focused):hover $wrapper:after": {
          borderColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.48 }, true, darkMode)
            : colors.createWhiteColor({ alpha: 0.48 }, true, darkMode)
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
            ? colors.createBlackColor({ alpha: 0.24 }, true, darkMode)
            : colors.createWhiteColor({ alpha: 0.24 }, true, darkMode),
          borderRadius: radius.small,
          pointerEvents: "none",
          transition: "border-color 240ms ease"
        }
      },
      shadow: {
        ...variants.body,
        visibility: "hidden",

        // Remove from the content flow
        position: "absolute",

        // Ignore the scrollbar width
        overflow: "hidden",

        border: "none",
        padding: 0,
        top: 0,
        left: 0,
        height: 0,

        // Create a new layer, increase the isolation of the computed values
        transform: "translateZ(0)"
      },
      input: {
        ...variants.body,
        color: !darkMode ? text.dark.primary : text.light.primary,
        minWidth: 0,
        outline: "none",
        border: "none",
        backgroundColor: colors.transparent,
        resize: "none",
        padding: [[spaces[3].rem, spaces[7].rem]],
        borderRadius: radius.small,
        boxShadow: `0 0 0 0 ${colors.transparent}`,
        appearance: "none !important",
        "&::-webkit-input-placeholder": {
          color: !darkMode ? text.dark.hint : text.light.hint
        },
        "&::-moz-placeholder": {
          color: !darkMode ? text.dark.hint : text.light.hint
        },
        "&:-ms-input-placeholder": {
          color: !darkMode ? text.dark.hint : text.light.hint
        },
        "&:-moz-placeholder": {
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
            ? colors.createBlackColor({ alpha: 0.04 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.04 }, false, darkMode)
        }
      },
      disabled: {
        pointerEvents: "none",
        "& $wrapper:after": {
          borderColor: !darkMode ? divider.dark : divider.light
        },
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
      focused: {
        "&:not($errored) $wrapper:after": {
          borderWidth: 2,
          borderColor: !darkMode ? blue[500] : blue[600]
        },
        "&$errored $wrapper:after": {
          borderWidth: 2,
          borderColor: !darkMode ? colors.error.origin : colors.error.light
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
        "& $input, & $shadow": {
          fontSize: variants.caption.fontSize!,
          lineHeight: variants.caption.lineHeight!,
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
        },
        "& $input": { padding: [[spaces[0].rem, spaces[3].rem]] }
      },
      medium: {
        "& $input, & $shadow": {
          fontSize: variants.caption.fontSize!,
          lineHeight: variants.caption.lineHeight!,
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
        },
        "& $input": { padding: [[spaces[2].rem, spaces[3].rem]] }
      },
      large: {},
      resizable: { "& $input": { resize: "vertical" } }
    };
  },
  { name: "SonnatTextArea" }
);

export default useStyles;
