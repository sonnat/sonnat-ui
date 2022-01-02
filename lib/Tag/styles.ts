import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      swatches: { blue },
      mixins: { asIconWrapper },
      typography: { pxToRem, setText, fontFamily }
    } = theme;

    const primaryColor = !darkMode
      ? colors.primary.origin
      : colors.primary.light;

    const primaryBgColor = colors.createPrimaryColor({ alpha: 0.08 }, true);
    const primaryMiddleColor = colors.createPrimaryColor({ alpha: 0.12 }, true);
    const primaryBorderColor = colors.createPrimaryColor({ alpha: 0.24 }, true);

    const secondaryColor = !darkMode
      ? colors.secondary.origin
      : colors.secondary.light;

    const secondaryBgColor = colors.createSecondaryColor({ alpha: 0.08 }, true);
    const secondaryMiddleColor = colors.createSecondaryColor(
      { alpha: 0.12 },
      true
    );
    const secondaryBorderColor = colors.createSecondaryColor(
      { alpha: 0.24 },
      true
    );

    const successColor = !darkMode
      ? colors.success.origin
      : colors.success.light;

    const successBgColor = colors.createSuccessColor({ alpha: 0.08 }, true);
    const successMiddleColor = colors.createSuccessColor({ alpha: 0.12 }, true);
    const successBorderColor = colors.createSuccessColor({ alpha: 0.24 }, true);

    const errorColor = !darkMode ? colors.error.origin : colors.error.light;
    const errorBgColor = colors.createErrorColor({ alpha: 0.08 }, true);
    const errorMiddleColor = colors.createErrorColor({ alpha: 0.12 }, true);
    const errorBorderColor = colors.createErrorColor({ alpha: 0.24 }, true);

    const warningColor = !darkMode
      ? colors.warning.origin
      : colors.warning.light;

    const warningBgColor = colors.createWarningColor({ alpha: 0.08 }, true);
    const warningMiddleColor = colors.createWarningColor({ alpha: 0.12 }, true);
    const warningBorderColor = colors.createWarningColor({ alpha: 0.24 }, true);

    const infoColor = !darkMode ? colors.info.origin : colors.info.light;
    const infoBgColor = colors.createInfoColor({ alpha: 0.08 }, true);
    const infoMiddleColor = colors.createInfoColor({ alpha: 0.12 }, true);
    const infoBorderColor = colors.createInfoColor({ alpha: 0.24 }, true);

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "middle",
        height: pxToRem(30),
        borderRadius: pxToRem(2),
        paddingRight: pxToRem(8),
        paddingLeft: pxToRem(8)
      },
      label: {
        ...setText({ fontSize: pxToRem(14), lineHeight: 1.5714285714 })
      },
      icon: {
        ...asIconWrapper(16),
        ...(direction === "rtl"
          ? { marginRight: pxToRem(-4), marginLeft: pxToRem(4) }
          : { marginLeft: pxToRem(-4), marginRight: pxToRem(4) })
      },
      removeBtn: {
        padding: "0",
        margin: "0",
        cursor: "pointer",
        borderRadius: "0",
        border: "none",
        minWidth: "auto",
        height: "100%",
        appearance: "none",
        backgroundColor: colors.transparent,
        zIndex: "2",
        pointerEvents: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: "0",
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(-4), marginRight: pxToRem(4) }
          : { marginRight: pxToRem(-4), marginLeft: pxToRem(4) }),
        "&:hover > $removeBtnIcon": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      removeBtnIcon: {
        ...asIconWrapper(16),
        backgroundColor: colors.transparent,
        borderRadius: "50%",
        transition: "background-color 360ms ease, color 360ms ease"
      },
      outlined: {},
      filled: {},
      removable: {},
      dense: { height: pxToRem(24), "& $label": { fontSize: pxToRem(12) } },
      default: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 })
          : colors.createWhiteColor({ alpha: 0.04 }),
        "& $label": { color: colors.text.secondary },
        "& $icon": { color: colors.text.secondary },
        "&$outlined": {
          border: `1px solid ${colors.divider}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: colors.text.secondary,
          "&:hover > $removeBtnIcon": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.12 })
              : colors.createWhiteColor({ alpha: 0.12 })
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.24 })
              : colors.createWhiteColor({ alpha: 0.24 })
          }
        }
      },
      primary: {
        color: primaryColor,
        backgroundColor: primaryBgColor,
        "& $label": { color: primaryColor },
        "& $icon": { color: primaryColor },
        "&$outlined": {
          border: `1px solid ${primaryBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: primaryColor,
          "&:hover > $removeBtnIcon": { backgroundColor: primaryMiddleColor },
          "&:active > $removeBtnIcon": { backgroundColor: primaryBorderColor }
        }
      },
      secondary: {
        color: secondaryColor,
        backgroundColor: secondaryBgColor,
        "& $label": { color: secondaryColor },
        "& $icon": { color: secondaryColor },
        "&$outlined": {
          border: `1px solid ${secondaryBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: secondaryColor,
          "&:hover > $removeBtnIcon": { backgroundColor: secondaryMiddleColor },
          "&:active > $removeBtnIcon": { backgroundColor: secondaryBorderColor }
        }
      },
      success: {
        color: successColor,
        backgroundColor: successBgColor,
        "& $label": { color: successColor },
        "& $icon": { color: successColor },
        "&$outlined": {
          border: `1px solid ${successBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: successColor,
          "&:hover > $removeBtnIcon": { backgroundColor: successMiddleColor },
          "&:active > $removeBtnIcon": { backgroundColor: successBorderColor }
        }
      },
      error: {
        color: errorColor,
        backgroundColor: errorBgColor,
        "& $label": { color: errorColor },
        "& $icon": { color: errorColor },
        "&$outlined": {
          border: `1px solid ${errorBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: errorColor,
          "&:hover > $removeBtnIcon": { backgroundColor: errorMiddleColor },
          "&:active > $removeBtnIcon": { backgroundColor: errorBorderColor }
        }
      },
      warning: {
        color: warningColor,
        backgroundColor: warningBgColor,
        "& $label": { color: warningColor },
        "& $icon": { color: warningColor },
        "&$outlined": {
          border: `1px solid ${warningBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: warningColor,
          "&:hover > $removeBtnIcon": { backgroundColor: warningMiddleColor },
          "&:active > $removeBtnIcon": { backgroundColor: warningBorderColor }
        }
      },
      info: {
        color: infoColor,
        backgroundColor: infoBgColor,
        "& $label": { color: infoColor },
        "& $icon": { color: infoColor },
        "&$outlined": {
          border: `1px solid ${infoBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: infoColor,
          "&:hover > $removeBtnIcon": { backgroundColor: infoMiddleColor },
          "&:active > $removeBtnIcon": { backgroundColor: infoBorderColor }
        }
      },
      focusVisible: {
        outline: `2px solid ${darkMode ? blue[500] : blue[600]}`,
        outlineOffset: 1
      }
    };
  },
  { name: "SonnatTag" }
);

export default useStyles;
