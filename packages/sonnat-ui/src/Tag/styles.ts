import { changeColorHsla } from "../styles/colorUtils";
import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      palette: { blue },
      mixins: { asIconWrapper },
      typography: { pxToRem, setText, fontFamily }
    } = theme;

    const primaryColor = !darkMode
      ? colors.primary.origin
      : colors.primary.light;
    const primaryBgColor = changeColorHsla(primaryColor, { alpha: 0.08 });
    const primaryMiddleColor = changeColorHsla(primaryColor, { alpha: 0.12 });
    const primaryBorderColor = changeColorHsla(primaryColor, { alpha: 0.24 });

    const secondaryColor = !darkMode
      ? colors.secondary.origin
      : colors.secondary.light;
    const secondaryBgColor = changeColorHsla(secondaryColor, { alpha: 0.08 });
    const secondaryMiddleColor = changeColorHsla(secondaryColor, {
      alpha: 0.12
    });
    const secondaryBorderColor = changeColorHsla(secondaryColor, {
      alpha: 0.24
    });

    const successColor = !darkMode
      ? colors.success.origin
      : colors.success.light;
    const successBgColor = changeColorHsla(successColor, { alpha: 0.08 });
    const successMiddleColor = changeColorHsla(successColor, { alpha: 0.12 });
    const successBorderColor = changeColorHsla(successColor, { alpha: 0.24 });

    const errorColor = !darkMode ? colors.error.origin : colors.error.light;
    const errorBgColor = changeColorHsla(errorColor, { alpha: 0.08 });
    const errorMiddleColor = changeColorHsla(errorColor, { alpha: 0.12 });
    const errorBorderColor = changeColorHsla(errorColor, { alpha: 0.24 });

    const warningColor = !darkMode
      ? colors.warning.origin
      : colors.warning.light;
    const warningBgColor = changeColorHsla(warningColor, { alpha: 0.08 });
    const warningMiddleColor = changeColorHsla(warningColor, { alpha: 0.12 });
    const warningBorderColor = changeColorHsla(warningColor, { alpha: 0.24 });

    const infoColor = !darkMode ? colors.info.origin : colors.info.light;
    const infoBgColor = changeColorHsla(infoColor, { alpha: 0.08 });
    const infoMiddleColor = changeColorHsla(infoColor, { alpha: 0.12 });
    const infoBorderColor = changeColorHsla(infoColor, { alpha: 0.24 });

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
      dense: {
        height: pxToRem(24),
        "& $label": { fontSize: pxToRem(12) }
      },
      default: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 })
          : colors.createWhiteColor({ alpha: 0.04 }),
        "& $label": { color: colors.text.secondary },
        "& $icon": { color: colors.text.secondary },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${colors.divider}`,
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
          border: `${pxToRem(1)} solid ${primaryBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: primaryColor,
          "&:hover > $removeBtnIcon": {
            backgroundColor: primaryMiddleColor
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: primaryBorderColor
          }
        }
      },
      secondary: {
        color: secondaryColor,
        backgroundColor: secondaryBgColor,
        "& $label": { color: secondaryColor },
        "& $icon": { color: secondaryColor },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${secondaryBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: secondaryColor,
          "&:hover > $removeBtnIcon": {
            backgroundColor: secondaryMiddleColor
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: secondaryBorderColor
          }
        }
      },
      success: {
        color: successColor,
        backgroundColor: successBgColor,
        "& $label": { color: successColor },
        "& $icon": { color: successColor },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${successBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: successColor,
          "&:hover > $removeBtnIcon": {
            backgroundColor: successMiddleColor
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: successBorderColor
          }
        }
      },
      error: {
        color: errorColor,
        backgroundColor: errorBgColor,
        "& $label": { color: errorColor },
        "& $icon": { color: errorColor },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${errorBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: errorColor,
          "&:hover > $removeBtnIcon": {
            backgroundColor: errorMiddleColor
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: errorBorderColor
          }
        }
      },
      warning: {
        color: warningColor,
        backgroundColor: warningBgColor,
        "& $label": { color: warningColor },
        "& $icon": { color: warningColor },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${warningBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: warningColor,
          "&:hover > $removeBtnIcon": {
            backgroundColor: warningMiddleColor
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: warningBorderColor
          }
        }
      },
      info: {
        color: infoColor,
        backgroundColor: infoBgColor,
        "& $label": { color: infoColor },
        "& $icon": { color: infoColor },
        "&$outlined": {
          border: `${pxToRem(1)} solid ${infoBorderColor}`,
          backgroundColor: colors.transparent
        },
        "& $removeBtn": {
          color: infoColor,
          "&:hover > $removeBtnIcon": {
            backgroundColor: infoMiddleColor
          },
          "&:active > $removeBtnIcon": {
            backgroundColor: infoBorderColor
          }
        }
      },
      focusVisible: {
        outline: `2px solid ${darkMode ? blue[300] : blue[500]}`,
        outlineOffset: 1
      }
    };
  },
  { name: "SonnatTag" }
);

export default useStyles;
