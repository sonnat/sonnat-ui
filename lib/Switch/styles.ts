import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      direction,
      radius,
      spacings: { spaces },
      mixins: { disableUserSelect },
      colors: { text, divider, ...colors },
      typography: { pxToRem, variants, fontFamily }
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
        ...variants.body,
        color: !darkMode ? text.dark.primary : text.light.primary,
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
            ? colors.createBlackColor({ alpha: 0.08 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.08 }, false, darkMode)
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
        borderRadius: radius.rounded,
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
          borderRadius: radius.rounded,
          position: "absolute",
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.04 }, false, darkMode),
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
        borderRadius: radius.rounded,
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: spaces[0].rem,
        boxSizing: "border-box",
        transition: "240ms ease",
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.24 }, true, darkMode)
          : colors.createWhiteColor({ alpha: 0.24 }, true, darkMode),
        pointerEvents: "none"
      },
      handle: {
        borderRadius: radius.rounded,
        backgroundColor: colors.white,
        boxShadow: `0px 2px 4px ${colors.createBlackColor(
          { alpha: 0.24 },
          false,
          darkMode
        )}`,
        zIndex: "2",
        pointerEvents: "none"
      },
      indicator: {
        width: "100%",
        height: "100%",
        borderRadius: radius.rounded,
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
          borderRadius: radius.rounded,
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
            ? colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.12 }, false, darkMode)
        }
      },
      disabled: {
        cursor: "not-allowed !important",
        "& $label": {
          pointerEvents: "none",
          color: !darkMode ? text.dark.disabled : text.light.disabled
        },
        "& $cell, & $input, & $track": {
          pointerEvents: "none"
        },
        "& $track": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.08 }, true, darkMode)
            : colors.createWhiteColor({ alpha: 0.08 }, true, darkMode)
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
          backgroundColor: colors.createPrimaryColor(
            { alpha: 0.08 },
            false,
            darkMode
          )
        },
        "& $button:before": {
          backgroundColor: colors.createPrimaryColor(
            { alpha: 0.04 },
            false,
            darkMode
          )
        }
      },
      checkedFocused: {
        "& $button:before": {
          backgroundColor: colors.createPrimaryColor(
            { alpha: 0.12 },
            false,
            darkMode
          )
        }
      },
      checkedDisabled: {
        "& $track": { pointerEvents: "none" },
        "& $indicator:after": {
          backgroundColor: !darkMode ? divider.dark : divider.light,
          pointerEvents: "none"
        }
      },
      large: {
        minHeight: pxToRem(44),
        "& $label": {
          fontSize: variants.body.fontSize,
          lineHeight: variants.body.lineHeight
        },
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
        "& $label": {
          fontSize: variants.bodySmall.fontSize,
          lineHeight: variants.bodySmall.lineHeight
        },
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
        "& $label": {
          fontSize: variants.caption.fontSize,
          lineHeight: variants.caption.lineHeight
        },
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
