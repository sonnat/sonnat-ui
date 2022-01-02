import makeStyles from "../styles/makeStyles";
import { dark, light } from "../styles/createColors";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      hacks,
      swatches: { grey },
      zIndexes: { popover },
      mixins: { asIconWrapper, disableUserSelect },
      typography: { pxToRem, setText, fontFamily, fontWeight }
    } = theme;

    const createColorStyles = (
      color: "success" | "error" | "warning" | "info"
    ) => ({
      backgroundColor: !darkMode ? colors[color].light : colors[color].dark,
      "& $icon": {
        color: colors.getContrastColorOf(
          !darkMode ? colors[color].light : colors[color].dark
        )
      },
      "& $text": {
        color: colors.getContrastColorOf(
          !darkMode ? colors[color].light : colors[color].dark
        )
      },
      "& $actionLabel, & $closeButtonIcon": {
        color: colors.getContrastColorOf(
          !darkMode ? colors[color].light : colors[color].dark
        )
      },
      "& $actionButton, & $closeButton": {
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createWhiteColor({ alpha: 0.04 })
            : colors.createBlackColor({ alpha: 0.04 })
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createWhiteColor({ alpha: 0.12 })
            : colors.createBlackColor({ alpha: 0.12 })
        }
      }
    });

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        minHeight: pxToRem(48),
        maxWidth: pxToRem(560),
        display: "inline-flex",
        alignItems: "center",
        padding: `0 ${pxToRem(16)}`,
        borderRadius: pxToRem(4),
        boxShadow: `0 1px 32px 0 rgba(0, 0, 0, 0.08),
        0 12px 16px 0 rgba(0, 0, 0, 0.12),
        0 8px 12px -6px rgba(0, 0, 0, 0.16)`,
        zIndex: popover,
        position: "fixed",
        bottom: pxToRem(24),
        "& > :last-child$divider": { display: "none" },
        "& > :last-child$actionButton": {
          ...(direction === "rtl"
            ? { marginLeft: pxToRem(-8) }
            : { marginRight: pxToRem(-8) })
        },
        visibility: "hidden",
        opacity: 0,
        transform: "scale(0.8)",
        transition:
          "transform 360ms cubic-bezier(0, 0, 0.2, 1), visibility 200ms ease, opacity 200ms ease"
      },
      icon: {
        ...asIconWrapper(16),
        flexShrink: 0,
        position: "relative",
        top: pxToRem(16),
        alignSelf: "flex-start",
        "& + $text": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(8) }
            : { marginLeft: pxToRem(8) })
        }
      },
      text: {
        ...setText({
          fontSize: pxToRem(14),
          lineHeight: 1.5714285714
        }),
        padding: `${pxToRem(10)} 0`,
        "& + $divider": { display: "none" },
        "& + *": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(16) }
            : { marginLeft: pxToRem(16) })
        }
      },
      buttonBase: {
        minWidth: pxToRem(32),
        height: pxToRem(24),
        padding: `0 ${pxToRem(12)}`,
        flexShrink: 0,
        appearance: "none !important",
        borderRadius: pxToRem(4),
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        outline: "none",
        verticalAlign: "middle",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        alignSelf: "flex-start",
        backgroundColor: colors.transparent,
        transition: "background-color 360ms ease"
      },
      actionButton: {
        extend: "buttonBase",
        top: pxToRem(12)
      },
      actionLabel: {
        ...setText({
          fontSize: pxToRem(12),
          lineHeight: 1.6666666667,
          fontWeight: fontWeight.medium
        }),
        ...disableUserSelect(),
        ...hacks.backfaceVisibilityFix,
        flexShrink: 0,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        transition: "color 360ms ease"
      },
      closeButton: {
        extend: "buttonBase",
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(-8) }
          : { marginRight: pxToRem(-8) }),
        width: pxToRem(24),
        height: pxToRem(24),
        padding: "0",
        minWidth: "auto",
        borderRadius: "50%",
        top: pxToRem(12)
      },
      closeButtonIcon: {},
      divider: {
        width: 1,
        backgroundColor: colors.divider,
        margin: `0 ${pxToRem(8)}`,
        alignSelf: "flex-start",
        height: pxToRem(24),
        position: "relative",
        top: pxToRem(12),
        flexShrink: "0"
      },
      left: { right: "auto", left: pxToRem(24) },
      right: { right: pxToRem(24), left: "auto" },
      center: {
        right: "auto",
        left: "50%",
        transform: "translateX(-50%) scale(0.8)"
      },
      open: {
        transform: "scale(1)",
        visibility: "visible",
        opacity: 1,
        "&$left": {},
        "&$right": {},
        "&$center": { transform: "translateX(-50%) scale(1)" }
      },
      hideDurationWrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 3,
        opacity: 0,
        transform: "translateY(100%)",
        visibility: "hidden",
        backgroundColor: !darkMode ? grey[900] : grey[50]
      },
      hideDurationIndicator: {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 0,
        backgroundColor: !darkMode
          ? colors.secondary.dark
          : colors.secondary.light
      },
      autoHidable: {
        borderRadius: `${pxToRem(4)} ${pxToRem(4)} 0 0`,
        "&$open $hideDurationWrapper": { opacity: 1, visibility: "visible" },
        "&$open $hideDurationIndicator": { width: "100%" }
      },
      default: {
        backgroundColor: !darkMode ? grey[900] : grey[50],
        "& $divider": {
          backgroundColor: !darkMode ? dark.divider : light.divider
        },
        "& $icon": {
          color: !darkMode ? dark.text.primary : light.text.primary
        },
        "& $text": {
          color: !darkMode ? dark.text.primary : light.text.primary
        },
        "& $actionLabel": {
          color: !darkMode ? colors.warning.light : colors.warning.origin
        },
        "& $closeButtonIcon": {
          color: !darkMode ? dark.text.primary : light.text.primary
        },
        "& $actionButton": {
          "&:hover": {
            backgroundColor: colors.createWarningColor({ alpha: 0.08 })
          },
          "&:active": {
            backgroundColor: colors.createWarningColor({ alpha: 0.12 })
          }
        },
        "& $closeButton": {
          "&:hover": {
            backgroundColor: !darkMode
              ? colors.createWhiteColor({ alpha: 0.08 })
              : colors.createBlackColor({ alpha: 0.08 })
          },
          "&:active": {
            backgroundColor: !darkMode
              ? colors.createWhiteColor({ alpha: 0.12 })
              : colors.createBlackColor({ alpha: 0.12 })
          }
        }
      },
      success: createColorStyles("success"),
      error: createColorStyles("error"),
      warning: createColorStyles("warning"),
      info: createColorStyles("info")
    };
  },
  { name: "SonnatSnackbar" }
);

export default useStyles;
