import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      typography: { pxToRem, setText, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        boxSizing: "content-box",
        verticalAlign: "middle",
        height: "auto",
        outline: "none"
      },
      label: setText({ color: colors.text.primary }),
      cell: {
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) }),
        borderRadius: "50%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "pointer",
        backfaceVisibility: "hidden",
        transform: "translate3d(0, 0, 0)",
        zIndex: "1",
        "&:before": {
          content: '""',
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          position: "absolute",
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 }, true)
            : colors.createWhiteColor({ alpha: 0.04 }, true),
          transform: "scale(0)",
          opacity: "0",
          transformOrigin: "center",
          transition:
            "transform 240ms ease, opacity 240ms ease, background-color 240ms ease"
        },
        "&:hover:before": {
          transform: "scale(1)",
          opacity: "1"
        }
      },
      input: {
        width: "100%",
        height: "100%",
        opacity: "0",
        margin: 0,
        zIndex: "1",
        cursor: "inherit",
        appearance: "none !important",
        WebkitTapHighlightColor: "rgba(0, 0, 0, 0) !important"
      },
      button: {
        border: `1px solid ${
          !darkMode
            ? colors.createBlackColor({ alpha: 0.24 }, true)
            : colors.createWhiteColor({ alpha: 0.24 }, true)
        }`,
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        overflow: "hidden",
        transition:
          "border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1)",
        "&:after": {
          content: '""',
          borderRadius: "50%",
          backgroundColor: !darkMode
            ? colors.primary.origin
            : colors.primary.light,
          opacity: "0",
          transform: "scale(0)",
          transformOrigin: "center",
          transition:
            "background-color 240ms ease, opacity 240ms ease, transform 240ms ease"
        }
      },
      focused: {
        "& $cell:before": {
          transform: "scale(1)",
          opacity: "1",
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 }, true)
            : colors.createWhiteColor({ alpha: 0.12 }, true)
        }
      },
      disabled: {
        cursor: "not-allowed !important",
        "& $label": {
          pointerEvents: "none",
          color: colors.text.disabled
        },
        "& $cell, & $input, & $button": {
          pointerEvents: "none"
        },
        "& $button": {
          borderColor: colors.divider
        }
      },
      checked: {
        "& $cell:before": {
          backgroundColor: colors.createPrimaryColor({ alpha: 0.04 }, true)
        },
        "&:not($disabled)": {
          "& $button": {
            borderColor: colors.createPrimaryColor({ alpha: 0.32 }, true),
            "&:after": { opacity: 1, transform: "scale(1)" }
          }
        }
      },
      checkedDisabled: {
        "& $button": {
          pointerEvents: "none",
          borderColor: colors.transparent,
          backgroundColor: colors.divider,
          "&:after": {
            opacity: 1,
            transform: "scale(1)",
            backgroundColor: !darkMode ? colors.white : colors.black
          }
        }
      },
      checkedFocused: {
        "& $cell:before": {
          backgroundColor: colors.createPrimaryColor({ alpha: 0.12 }, true)
        }
      },
      large: {
        "& $cell": {
          width: pxToRem(36),
          height: pxToRem(36),
          minWidth: pxToRem(36),
          minHeight: pxToRem(36)
        },
        "& $label": { fontSize: pxToRem(16), lineHeight: 1.625 },
        "& $button": {
          width: pxToRem(18),
          height: pxToRem(18),
          "&:after": { width: pxToRem(10), height: pxToRem(10) }
        }
      },
      medium: {
        "& $cell": {
          width: pxToRem(32),
          height: pxToRem(32),
          minWidth: pxToRem(32),
          minHeight: pxToRem(32)
        },
        "& $label": { fontSize: pxToRem(14), lineHeight: 1.5714285714 },
        "& $button": {
          width: pxToRem(16),
          height: pxToRem(16),
          "&:after": { width: pxToRem(8), height: pxToRem(8) }
        }
      },
      small: {
        "& $cell": {
          width: pxToRem(28),
          height: pxToRem(28),
          minWidth: pxToRem(28),
          minHeight: pxToRem(28)
        },
        "& $label": { fontSize: pxToRem(12), lineHeight: 1.6666666667 },
        "& $button": {
          width: pxToRem(14),
          height: pxToRem(14),
          "&:after": { width: pxToRem(6), height: pxToRem(6) }
        }
      },
      fluid: { width: "100%", justifyContent: "space-between" }
    };
  },
  { name: "SonnatRadio" }
);

export default useStyles;
