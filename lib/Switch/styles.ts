import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      spacings: { spaces },
      mixins: { disableUserSelect },
      typography: { pxToRem, setText, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "inline-flex",
        alignItems: "center",
        flexDirection: "row-reverse",
        verticalAlign: "middle",
        outline: "none"
      },
      label: {
        ...setText({ color: colors.text.primary }),
        ...(direction === "rtl"
          ? { marginLeft: spaces[1].rem }
          : { marginRight: spaces[1].rem })
      },
      cell: {
        marginRight: spaces[3].rem,
        marginLeft: spaces[3].rem,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        "&:hover $button:before": {
          transform: "scale(1)",
          opacity: "1"
        },
        "&:active $button:before": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.08 })
            : colors.createWhiteColor({ alpha: 0.08 })
        }
      },
      input: {
        width: "100%",
        height: "100%",
        zIndex: "1",
        cursor: "inherit",
        opacity: 0,
        margin: 0,
        appearance: "none !important",
        WebkitTapHighlightColor: "rgba(0, 0, 0, 0) !important"
      },
      button: {
        borderRadius: "50%",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        zIndex: 2,
        transition: "120ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&:before": {
          content: '""',
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          position: "absolute",
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 }),
          transform: "scale(0)",
          opacity: "0",
          zIndex: "-1",
          transformOrigin: "center",
          transition: "240ms ease"
        }
      },
      track: {
        width: "100%",
        height: "100%",
        borderRadius: pxToRem(12),
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: spaces[0].rem,
        boxSizing: "border-box",
        transition: "240ms ease",
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.24 }, true)
          : colors.createWhiteColor({ alpha: 0.24 }, true),
        pointerEvents: "none"
      },
      handle: {
        borderRadius: "50%",
        backgroundColor: colors.white,
        boxShadow: `0px 2px 4px ${colors.createBlackColor({ alpha: 0.24 })}`,
        zIndex: "2",
        pointerEvents: "none"
      },
      indicator: {
        width: "100%",
        height: "100%",
        borderRadius: pxToRem(12),
        top: "0",
        right: "0",
        position: "absolute",
        overflow: "hidden",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backfaceVisibility: "hidden",
        transform: "translate3d(0, 0, 0)",
        zIndex: "1",
        "&:after": {
          ...(direction === "rtl"
            ? { right: pxToRem(-12) }
            : { left: pxToRem(-12) }),
          ...disableUserSelect(),
          content: '""',
          width: pxToRem(48),
          height: pxToRem(48),
          borderRadius: "50%",
          backgroundColor: !darkMode
            ? colors.primary.origin
            : colors.primary.light,
          position: "absolute",
          opacity: "0",
          transform: "scale(0)",
          transformOrigin: "center",
          transition:
            "transform 360ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms ease",
          pointerEvents: "none",
          zIndex: "-1"
        }
      },
      focused: {
        "& $button:before": {
          transform: "scale(1)",
          opacity: "1",
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 })
            : colors.createWhiteColor({ alpha: 0.12 })
        }
      },
      disabled: {
        cursor: "not-allowed !important",
        "& $label": {
          pointerEvents: "none",
          color: colors.text.disabled
        },
        "& $cell, & $input, & $track": {
          pointerEvents: "none"
        },
        "& $track": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.08 }, true)
            : colors.createWhiteColor({ alpha: 0.08 }, true)
        },
        "& $handle": {
          boxShadow: "none",
          backgroundColor: !darkMode ? colors.white : colors.black
        }
      },
      checked: {
        "& $indicator:after": {
          opacity: 1,
          transform: "scale(1.25)"
        },
        "& $cell:active $button:before": {
          backgroundColor: colors.createPrimaryColor({ alpha: 0.08 })
        },
        "& $button:before": {
          backgroundColor: colors.createPrimaryColor({ alpha: 0.04 })
        }
      },
      checkedFocused: {
        "& $button:before": {
          backgroundColor: colors.createPrimaryColor({ alpha: 0.12 })
        }
      },
      checkedDisabled: {
        "& $track": { pointerEvents: "none" },
        "& $indicator:after": {
          backgroundColor: colors.divider,
          pointerEvents: "none"
        }
      },
      large: {
        minHeight: pxToRem(44),
        "& $label": { fontSize: pxToRem(16), lineHeight: 1.625 },
        "& $cell": { width: pxToRem(42), height: pxToRem(24) },
        "& $handle": { width: pxToRem(20), height: pxToRem(20) },
        "& $button": {
          ...(direction === "rtl"
            ? { right: pxToRem(-10) }
            : { left: pxToRem(-10) }),
          width: pxToRem(44),
          height: pxToRem(44)
        },
        "&$checked $button": {
          ...(direction === "rtl"
            ? { transform: `translateX(${pxToRem(-18)})` }
            : { transform: `translateX(${pxToRem(18)})` })
        }
      },
      medium: {
        minHeight: pxToRem(34),
        "& $label": { fontSize: pxToRem(14), lineHeight: 1.5714285714 },
        "& $cell": { width: pxToRem(32), height: pxToRem(18) },
        "& $handle": { width: pxToRem(16), height: pxToRem(16) },
        "& $button": {
          ...(direction === "rtl"
            ? { right: pxToRem(-8) }
            : { left: pxToRem(-8) }),
          width: pxToRem(34),
          height: pxToRem(34)
        },
        "&$checked $button": {
          ...(direction === "rtl"
            ? { transform: `translateX(${pxToRem(-14)})` }
            : { transform: `translateX(${pxToRem(14)})` })
        }
      },
      small: {
        minHeight: pxToRem(26),
        "& $label": { fontSize: pxToRem(12), lineHeight: 1.6666666667 },
        "& $cell": { width: pxToRem(24), height: pxToRem(14) },
        "& $handle": { width: pxToRem(12), height: pxToRem(12) },
        "& $button": {
          ...(direction === "rtl"
            ? { right: pxToRem(-6) }
            : { left: pxToRem(-6) }),
          width: pxToRem(26),
          height: pxToRem(26)
        },
        "&$checked $button": {
          ...(direction === "rtl"
            ? { transform: `translateX(${pxToRem(-10)})` }
            : { transform: `translateX(${pxToRem(10)})` })
        }
      },
      fluid: { width: "100%", justifyContent: "space-between" }
    };
  },
  { name: "SonnatSwitch" }
);

export default useStyles;
