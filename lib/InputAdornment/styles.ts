import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      spacings: { spaces },
      swatches: { blue },
      mixins: { asIconWrapper },
      typography: { pxToRem, setText, fontWeight, fontFamily }
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
        ...setText({ color: colors.text.hint }),
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
            ? colors.createBlackColor({ alpha: 0.48 }, true)
            : colors.createWhiteColor({ alpha: 0.87 }, true),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.64 }, true)
            : colors.createWhiteColor({ alpha: 0.56 }, true)
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
          fontSize: pxToRem(10),
          fontWeight: fontWeight.medium,
          lineHeight: 1.8
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
          fontSize: pxToRem(10),
          fontWeight: fontWeight.medium,
          lineHeight: 1.8
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
