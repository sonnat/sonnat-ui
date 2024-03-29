import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      direction,
      spacings: { spaces },
      swatches: { blue },
      mixins: { asIconWrapper },
      colors: { text, divider, ...colors },
      typography: { pxToRem, variants, fontWeight, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        transition: "color 180ms ease"
      },
      nodeAdornment: { display: "inline-flex", alignItems: "center" },
      iconAdornment: { color: !darkMode ? text.dark.hint : text.light.hint },
      textAdornment: {
        ...variants.body,
        color: !darkMode ? text.dark.hint : text.light.hint,
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
            ? colors.createBlackColor({ alpha: 0.48 }, true, darkMode)
            : colors.createWhiteColor({ alpha: 0.87 }, true, darkMode),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.64 }, true, darkMode)
            : colors.createWhiteColor({ alpha: 0.56 }, true, darkMode)
        }
      },
      disabled: {
        "&$textAdornment": {
          color: !darkMode ? text.dark.hint : text.light.hint
        },
        "&$iconAdornment": { color: !darkMode ? divider.dark : divider.light }
      },
      large: {
        "&$textAdornment": {
          minWidth: pxToRem(24),
          fontSize: variants.bodySmall.fontSize,
          lineHeight: variants.bodySmall.lineHeight
        },
        "&$iconAdornment": asIconWrapper(24),
        "& + *": {
          ...(direction === "rtl"
            ? { marginRight: spaces[3].rem }
            : { marginLeft: spaces[3].rem })
        }
      },
      medium: {
        "&$textAdornment": {
          minWidth: pxToRem(16),
          fontSize: variants.captionSmall.fontSize,
          lineHeight: variants.captionSmall.lineHeight,
          fontWeight: fontWeight.medium
        },
        "&$iconAdornment": asIconWrapper(16),
        "& + *": {
          ...(direction === "rtl"
            ? { marginRight: spaces[1].rem }
            : { marginLeft: spaces[1].rem })
        }
      },
      small: {
        "&$textAdornment": {
          minWidth: pxToRem(16),
          fontSize: variants.captionSmall.fontSize,
          lineHeight: variants.captionSmall.lineHeight,
          fontWeight: fontWeight.medium
        },
        "&$iconAdornment": asIconWrapper(14),
        "& + *": {
          ...(direction === "rtl"
            ? { marginRight: spaces[1].rem }
            : { marginLeft: spaces[1].rem })
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
        outline: `2px solid ${darkMode ? blue[500] : blue[600]}`,
        outlineOffset: 1
      }
    };
  },
  { name: "SonnatInputAdornment" }
);

export default useStyles;
