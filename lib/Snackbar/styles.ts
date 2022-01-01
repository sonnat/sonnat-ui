import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      swatches: { grey },
      zIndexes: { popover },
      mixins: { asIconWrapper },
      typography: { pxToRem, setText, fontFamily }
    } = theme;

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
        backgroundColor: !darkMode ? grey[900] : grey[50],
        zIndex: popover,
        position: "fixed",
        bottom: pxToRem(24),
        "& > :last-child$divider": { display: "none" },
        "& > :last-child$undoButton": {
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
        color: !darkMode ? colors.white : "#212121",
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
          lineHeight: 1.5714285714,
          color: !darkMode ? colors.white : "#212121"
        }),
        padding: `${pxToRem(10)} 0`,
        "& + $divider": { display: "none" },
        "& + *": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(16) }
            : { marginLeft: pxToRem(16) })
        }
      },
      undoButton: {
        alignSelf: "flex-start",
        flexShrink: "0",
        position: "relative",
        top: pxToRem(8)
      },
      closeButton: {
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(-8) }
          : { marginRight: pxToRem(-8) }),
        alignSelf: "flex-start",
        flexShrink: "0",
        position: "relative",
        top: pxToRem(12)
      },
      closeButtonIcon: {},
      divider: {
        width: pxToRem(1),
        backgroundColor: !darkMode
          ? colors.createWhiteColor({ alpha: 0.12 }, true)
          : colors.createBlackColor({ alpha: 0.12 }, true),
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
      }
    };
  },
  { name: "SonnatSnackbar" }
);

export default useStyles;
