import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      direction,
      radius,
      colors: { text, divider, ...colors },
      spacings: { spaces },
      swatches: { grey },
      zIndexes: { popover },
      hacks: { backfaceVisibilityFix },
      mixins: { asIconWrapper, disableUserSelect },
      typography: { pxToRem, variants, fontFamily, fontWeight }
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
            ? colors.createWhiteColor({ alpha: 0.04 }, false, darkMode)
            : colors.createBlackColor({ alpha: 0.04 }, false, darkMode)
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createWhiteColor({ alpha: 0.12 }, false, darkMode)
            : colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
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
        padding: `0 ${spaces[7].rem}`,
        borderRadius: radius.small,
        boxShadow: `0 1px 32px 0 rgba(0, 0, 0, 0.08),
        0 12px 16px 0 rgba(0, 0, 0, 0.12),
        0 8px 12px -6px rgba(0, 0, 0, 0.16)`,
        zIndex: popover,
        position: "fixed",
        bottom: pxToRem(24),
        "& > :last-child$divider": { display: "none" },
        "& > :last-child$actionButton": {
          ...(direction === "rtl"
            ? { marginLeft: pxToRem(spaces[3].px - spaces[7].px) }
            : { marginRight: pxToRem(spaces[3].px - spaces[7].px) })
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
            ? { marginRight: spaces[3].rem }
            : { marginLeft: spaces[3].rem })
        }
      },
      text: {
        ...variants.bodySmall,
        padding: `${spaces[4].rem} 0`,
        "& + $divider": { display: "none" },
        "& + *": {
          ...(direction === "rtl"
            ? { marginRight: spaces[7].rem }
            : { marginLeft: spaces[7].rem })
        }
      },
      buttonBase: {
        ...backfaceVisibilityFix,
        minWidth: pxToRem(32),
        height: pxToRem(24),
        padding: `0 ${spaces[5].rem}`,
        flexShrink: 0,
        appearance: "none !important",
        borderRadius: radius.small,
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
        ...variants.caption,
        ...disableUserSelect(),
        ...backfaceVisibilityFix,
        fontWeight: fontWeight.medium,
        flexShrink: 0,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        transition: "color 360ms ease"
      },
      closeButton: {
        extend: "buttonBase",
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(spaces[3].px - spaces[7].px) }
          : { marginRight: pxToRem(spaces[3].px - spaces[7].px) }),
        width: pxToRem(24),
        height: pxToRem(24),
        padding: "0",
        minWidth: "auto",
        borderRadius: radius.rounded,
        top: pxToRem(12)
      },
      closeButtonIcon: {},
      divider: {
        width: 1,
        backgroundColor: darkMode ? divider.dark : divider.light,
        margin: `0 ${spaces[3].rem}`,
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
        borderRadius: `${radius.small} ${radius.small} 0 0`,
        "&$open $hideDurationWrapper": { opacity: 1, visibility: "visible" },
        "&$open $hideDurationIndicator": { width: "100%" }
      },
      default: {
        backgroundColor: !darkMode ? grey[900] : grey[50],
        "& $divider": {
          backgroundColor: !darkMode ? divider.light : divider.dark
        },
        "& $icon": {
          color: !darkMode ? text.light.primary : text.dark.primary
        },
        "& $text": {
          color: !darkMode ? text.light.primary : text.dark.primary
        },
        "& $actionLabel": {
          color: !darkMode ? colors.warning.light : colors.warning.origin
        },
        "& $closeButtonIcon": {
          color: !darkMode ? text.light.primary : text.dark.primary
        },
        "& $actionButton": {
          "&:hover": {
            backgroundColor: colors.createWarningColor(
              { alpha: 0.08 },
              false,
              darkMode
            )
          },
          "&:active": {
            backgroundColor: colors.createWarningColor(
              { alpha: 0.12 },
              false,
              darkMode
            )
          }
        },
        "& $closeButton": {
          "&:hover": {
            backgroundColor: !darkMode
              ? colors.createWhiteColor({ alpha: 0.08 }, false, darkMode)
              : colors.createBlackColor({ alpha: 0.08 }, false, darkMode)
          },
          "&:active": {
            backgroundColor: !darkMode
              ? colors.createWhiteColor({ alpha: 0.12 }, false, darkMode)
              : colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
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
