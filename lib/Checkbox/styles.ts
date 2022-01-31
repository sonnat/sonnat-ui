import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      direction,
      radius,
      colors: { text, divider, ...colors },
      spacings: { spaces },
      typography: { pxToRem, variants, fontFamily }
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
        outline: "none"
      },
      label: {
        ...variants.body,
        color: !darkMode ? text.dark.primary : text.light.primary
      },
      cell: {
        borderRadius: radius.rounded,
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
          borderRadius: radius.rounded,
          position: "absolute",
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.04 }, false, darkMode),
          transform: "scale(0)",
          opacity: "0",
          transformOrigin: "center",
          transition:
            "transform 240ms ease, opacity 240ms ease, background-color 240ms ease"
        },
        "&:hover:before": {
          transform: "scale(1)",
          opacity: "1"
        },
        ...(direction === "rtl"
          ? { marginLeft: spaces[1].rem }
          : { marginRight: spaces[1].rem })
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
            ? colors.createBlackColor({ alpha: 0.24 }, true, darkMode)
            : colors.createWhiteColor({ alpha: 0.24 }, true, darkMode)
        }`,
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius.xSmall,
        overflow: "hidden",
        transition:
          "border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1)"
      },
      checkIcon: {
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        justifyContent: "center",
        transition: "transform 400ms ease",
        "& svg": { width: pxToRem(12), height: pxToRem(8) },
        "& polyline": {
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          stroke: colors.getContrastColorOf(
            !darkMode ? colors.primary.origin : colors.primary.light
          ),
          strokeWidth: "2",
          strokeDasharray: "48",
          strokeDashoffset: "48",
          animation: "$uncheckAnimation 200ms ease-out forwards"
        },
        "& line": {
          opacity: 0,
          stroke: colors.getContrastColorOf(
            !darkMode ? colors.primary.origin : colors.primary.light
          )
        }
      },
      indeterminated: {
        "&:not($checked):not($disabled)": {
          "& $button": {
            borderColor: !darkMode
              ? colors.primary.origin
              : colors.primary.light,
            backgroundColor: !darkMode
              ? colors.primary.origin
              : colors.primary.light
          },
          "& $checkIcon": {
            transform: "rotate(-360deg)",
            "& line": {
              opacity: "1",
              transform: "scale(1)",
              transformOrigin: "0 center",
              transition: "opacity 200ms ease, transform 200ms ease"
            }
          }
        },
        "&:not($checked)$disabled": {
          "& $button": {
            pointerEvents: "none",
            borderColor: colors.transparent,
            backgroundColor: !darkMode ? divider.dark : divider.light
          },
          "& $checkIcon": {
            transform: "rotate(-360deg)",
            "& line": {
              opacity: "1",
              transform: "scale(1)",
              transformOrigin: "0 center",
              transition: "opacity 200ms ease, transform 200ms ease"
            }
          }
        }
      },
      focused: {
        "& $cell:before": {
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
        "& $cell, & $input, & $button": { pointerEvents: "none" },
        "& $button": { borderColor: !darkMode ? divider.dark : divider.light }
      },
      checked: {
        "& $cell:before": {
          backgroundColor: colors.createPrimaryColor(
            { alpha: 0.04 },
            false,
            darkMode
          )
        },
        "& $button": {
          borderColor: !darkMode ? colors.primary.origin : colors.primary.light,
          backgroundColor: !darkMode
            ? colors.primary.origin
            : colors.primary.light
        },
        "& $checkIcon polyline": {
          opacity: 1,
          animation:
            "$checkAnimation 200ms cubic-bezier(0.65, 0, 0.45, 1) 48ms forwards"
        }
      },
      checkedDisabled: {
        "& $button": {
          pointerEvents: "none",
          borderColor: colors.transparent,
          backgroundColor: !darkMode ? divider.dark : divider.light
        },
        "& $checkIcon polyline": {
          stroke: !darkMode ? colors.white : colors.black
        }
      },
      checkedFocused: {
        "& $cell:before": {
          backgroundColor: colors.createPrimaryColor(
            { alpha: 0.12 },
            false,
            darkMode
          )
        }
      },
      "@keyframes checkAnimation": {
        from: {
          strokeDashoffset: "48"
        },
        to: {
          strokeDashoffset: "0"
        }
      },
      "@keyframes uncheckAnimation": {
        from: {
          strokeDashoffset: "0"
        },
        to: {
          strokeDashoffset: "48"
        }
      },
      large: {
        "& $cell": {
          width: pxToRem(36),
          height: pxToRem(36),
          minWidth: pxToRem(36),
          minHeight: pxToRem(36)
        },
        "& $label": {
          fontSize: variants.body.fontSize,
          lineHeight: variants.body.lineHeight
        },
        "& $button": { width: pxToRem(18), height: pxToRem(18) },
        "& $checkIcon": {
          width: pxToRem(18),
          height: pxToRem(18)
        }
      },
      medium: {
        "& $cell": {
          width: pxToRem(32),
          height: pxToRem(32),
          minWidth: pxToRem(32),
          minHeight: pxToRem(32)
        },
        "& $label": {
          fontSize: variants.bodySmall.fontSize,
          lineHeight: variants.bodySmall.lineHeight
        },
        "& $button": { width: pxToRem(16), height: pxToRem(16) },
        "& $checkIcon": {
          width: pxToRem(16),
          height: pxToRem(16)
        }
      },
      small: {
        "& $cell": {
          width: pxToRem(28),
          height: pxToRem(28),
          minWidth: pxToRem(28),
          minHeight: pxToRem(28)
        },
        "& $label": {
          fontSize: variants.caption.fontSize,
          lineHeight: variants.caption.lineHeight
        },
        "& $button": { width: pxToRem(14), height: pxToRem(14) },
        "& $checkIcon": {
          width: pxToRem(14),
          height: pxToRem(14)
        }
      },
      fluid: { width: "100%", justifyContent: "space-between" }
    };
  },
  { name: "SonnatCheckbox" }
);

export default useStyles;
