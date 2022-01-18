import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      radius,
      spacings: { spaces },
      swatches: { blue },
      mixins: { asIconWrapper },
      typography: { pxToRem, variants, fontFamily }
    } = theme;

    const primaryColor = !darkMode
      ? colors.primary.origin
      : colors.primary.light;

    const primaryBgColor = colors.createPrimaryColor({ alpha: 0.08 });
    const primaryMiddleColor = colors.createPrimaryColor({ alpha: 0.12 });
    const primaryBorderColor = colors.createPrimaryColor({ alpha: 0.24 });

    const secondaryColor = !darkMode
      ? colors.secondary.origin
      : colors.secondary.light;

    const secondaryBgColor = colors.createSecondaryColor({ alpha: 0.08 });
    const secondaryMiddleColor = colors.createSecondaryColor({ alpha: 0.12 });
    const secondaryBorderColor = colors.createSecondaryColor({ alpha: 0.24 });

    const successColor = !darkMode
      ? colors.success.origin
      : colors.success.light;

    const successBgColor = colors.createSuccessColor({ alpha: 0.08 });
    const successMiddleColor = colors.createSuccessColor({ alpha: 0.12 });
    const successBorderColor = colors.createSuccessColor({ alpha: 0.24 });

    const errorColor = !darkMode ? colors.error.origin : colors.error.light;
    const errorBgColor = colors.createErrorColor({ alpha: 0.08 });
    const errorMiddleColor = colors.createErrorColor({ alpha: 0.12 });
    const errorBorderColor = colors.createErrorColor({ alpha: 0.24 });

    const warningColor = !darkMode
      ? colors.warning.origin
      : colors.warning.light;

    const warningBgColor = colors.createWarningColor({ alpha: 0.08 });
    const warningMiddleColor = colors.createWarningColor({ alpha: 0.12 });
    const warningBorderColor = colors.createWarningColor({ alpha: 0.24 });

    const infoColor = !darkMode ? colors.info.origin : colors.info.light;
    const infoBgColor = colors.createInfoColor({ alpha: 0.08 });
    const infoMiddleColor = colors.createInfoColor({ alpha: 0.12 });
    const infoBorderColor = colors.createInfoColor({ alpha: 0.24 });

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "middle",
        height: pxToRem(30),
        borderRadius: radius.xSmall,
        paddingRight: spaces[3].rem,
        paddingLeft: spaces[3].rem
      },
      label: variants.bodySmall,
      icon: {
        ...asIconWrapper(16),
        ...(direction === "rtl"
          ? {
              marginRight: pxToRem(spaces[1].px - spaces[3].px),
              marginLeft: spaces[1].rem
            }
          : {
              marginLeft: pxToRem(spaces[1].px - spaces[3].px),
              marginRight: spaces[1].rem
            })
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
          ? {
              marginLeft: pxToRem(spaces[1].px - spaces[3].px),
              marginRight: spaces[1].rem
            }
          : {
              marginRight: pxToRem(spaces[1].px - spaces[3].px),
              marginLeft: spaces[1].rem
            }),
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
        borderRadius: radius.rounded,
        transition: "background-color 360ms ease, color 360ms ease"
      },
      outlined: {},
      filled: {},
      removable: {},
      dense: {
        height: pxToRem(24),
        "& $label": {
          fontSize: variants.caption.fontSize,
          lineHeight: variants.caption.lineHeight
        }
      },
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
