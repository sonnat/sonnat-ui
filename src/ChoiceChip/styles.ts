import { adjustColorHsla, changeColorHsla } from "../styles/colorUtils";
import makeStyles from "../styles/makeStyles";

export type VariantColorSelectionCombo =
  | "filledDefaultSelected"
  | "filledPrimarySelected"
  | "filledSecondarySelected"
  | "outlinedDefaultSelected"
  | "outlinedPrimarySelected"
  | "outlinedSecondarySelected";

export type VariantUnselectionCombo = "filledUnselected" | "outlinedUnselected";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      palette: { blue, grey },
      mixins: { asIconWrapper, disableUserSelect },
      typography: { pxToRem, setText, fontFamily }
    } = theme;

    const filledDefaultMainBg = colors.text.secondary;
    const filledPrimarySelectedMainBg = !darkMode
      ? colors.primary.origin
      : colors.primary.light;

    const filledSecondarySelectedMainBg = !darkMode
      ? colors.secondary.origin
      : colors.secondary.light;

    const filledDefault = {
      background: {
        main: filledDefaultMainBg,
        hover: !darkMode
          ? adjustColorHsla(filledDefaultMainBg, { lightness: 12 })
          : colors.createWhiteColor({ alpha: 0.98 }),
        active: !darkMode
          ? colors.createBlackColor({ alpha: 0.6 })
          : colors.createWhiteColor({ alpha: 0.5 })
      },
      text: colors.getContrastColorOf(filledDefaultMainBg)
    };

    const filledPrimarySelected = {
      background: {
        main: filledPrimarySelectedMainBg,
        hover: adjustColorHsla(filledPrimarySelectedMainBg, {
          saturation: -8,
          lightness: +8
        }),
        active: adjustColorHsla(filledPrimarySelectedMainBg, {
          saturation: +8,
          lightness: -4
        })
      },
      text: colors.getContrastColorOf(filledPrimarySelectedMainBg)
    };

    const filledSecondarySelected = {
      background: {
        main: filledSecondarySelectedMainBg,
        hover: adjustColorHsla(filledSecondarySelectedMainBg, {
          saturation: -8,
          lightness: +8
        }),
        active: adjustColorHsla(filledSecondarySelectedMainBg, {
          saturation: +8,
          lightness: -4
        })
      },
      text: colors.getContrastColorOf(filledSecondarySelectedMainBg)
    };

    return {
      root: {
        ...setText(),
        ...disableUserSelect(),
        direction,
        fontFamily: fontFamily[direction],
        padding: `0 ${pxToRem(12)}`,
        outline: "none",
        display: "inline-flex",
        alignItems: "center",
        alignSelf: "center",
        borderRadius: pxToRem(2),
        verticalAlign: "middle",
        overflow: "hidden",
        position: "relative",
        zIndex: "1",
        flexShrink: "0",
        cursor: "pointer",
        transition:
          "color 360ms ease, background-color 360ms ease, border 360ms ease"
      },
      icon: {
        ...asIconWrapper(16),
        flexShrink: "0",
        transition: "color 360ms ease"
      },
      small: {
        height: pxToRem(20),
        fontSize: pxToRem(10),
        padding: `0 ${pxToRem(8)}`,
        lineHeight: 1.8,
        "& $icon": {
          ...asIconWrapper(14),
          ...(direction === "rtl"
            ? { marginRight: pxToRem(-2), marginLeft: pxToRem(4) }
            : { marginLeft: pxToRem(-2), marginRight: pxToRem(4) })
        }
      },
      medium: {
        height: pxToRem(28),
        fontSize: pxToRem(12),
        lineHeight: 1.6666666667,
        "& $icon": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(-6), marginLeft: pxToRem(4) }
            : { marginLeft: pxToRem(-6), marginRight: pxToRem(4) })
        }
      },
      large: {
        height: pxToRem(32),
        fontSize: pxToRem(14),
        lineHeight: 1.5714285714,
        "& $icon": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(-4), marginLeft: pxToRem(4) }
            : { marginLeft: pxToRem(-4), marginRight: pxToRem(4) })
        }
      },
      rounded: {
        borderRadius: pxToRem(16)
      },
      disabled: {
        pointerEvents: "none",
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        }
      },
      selected: {},
      filled: {
        "&$disabled": {
          "&:not($selected)": {
            backgroundColor: !darkMode ? grey[100] : grey[900],
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 })
              : colors.createWhiteColor({ alpha: 0.12 }),
            "& $icon": {
              color: !darkMode
                ? colors.createBlackColor({ alpha: 0.32 })
                : colors.createWhiteColor({ alpha: 0.12 })
            }
          },
          "&$selected": {
            backgroundColor: !darkMode ? grey[300] : grey[700],
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 })
              : colors.createWhiteColor({ alpha: 0.32 }),
            "& $icon": {
              color: !darkMode
                ? colors.createBlackColor({ alpha: 0.32 })
                : colors.createWhiteColor({ alpha: 0.32 })
            }
          }
        }
      },
      outlined: {
        "&$disabled": {
          backgroundColor: colors.transparent
        }
      },
      filledUnselected: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 })
          : colors.createWhiteColor({ alpha: 0.04 }),
        color: colors.text.secondary,
        "& $icon": { color: colors.text.secondary },
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 })
            : colors.createWhiteColor({ alpha: 0.12 }),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.24 })
            : colors.createWhiteColor({ alpha: 0.24 })
        }
      },
      outlinedUnselected: {
        backgroundColor: colors.transparent,
        border: `${pxToRem(1)} solid ${colors.divider}`,
        color: colors.text.secondary,
        "& $icon": { color: colors.text.secondary },
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 }),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 })
            : colors.createWhiteColor({ alpha: 0.12 })
        },
        "&$disabled": {
          borderColor: colors.divider,
          color: colors.text.disabled,
          "& $icon": { color: colors.text.disabled }
        }
      },
      filledDefaultSelected: {
        backgroundColor: filledDefault.background.main,
        color: filledDefault.text,
        "& $icon": { color: filledDefault.text },
        "&:hover": {
          backgroundColor: filledDefault.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: filledDefault.background.active
        }
      },
      filledPrimarySelected: {
        backgroundColor: filledPrimarySelected.background.main,
        color: filledPrimarySelected.text,
        "& $icon": { color: filledPrimarySelected.text },
        "&:hover": {
          backgroundColor: filledPrimarySelected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: filledPrimarySelected.background.active
        }
      },
      filledSecondarySelected: {
        backgroundColor: filledSecondarySelected.background.main,
        color: filledSecondarySelected.text,
        "& $icon": { color: filledSecondarySelected.text },
        "&:hover": {
          backgroundColor: filledSecondarySelected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: filledSecondarySelected.background.active
        }
      },
      outlinedDefaultSelected: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 })
          : colors.createWhiteColor({ alpha: 0.04 }),
        border: `${pxToRem(1)} solid ${
          !darkMode
            ? colors.createBlackColor({ alpha: 0.48 })
            : colors.createWhiteColor({ alpha: 0.48 })
        }`,
        color: colors.text.secondary,
        "& $icon": { color: colors.text.secondary },
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 })
            : colors.createWhiteColor({ alpha: 0.12 }),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.24 })
            : colors.createWhiteColor({ alpha: 0.24 })
        },
        "&$disabled": {
          backgroundColor: !darkMode ? grey[100] : grey[900],
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.32 })
            : colors.createWhiteColor({ alpha: 0.32 }),
          "& $icon": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 })
              : colors.createWhiteColor({ alpha: 0.32 })
          },
          borderColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 })
            : colors.createWhiteColor({ alpha: 0.12 })
        }
      },
      outlinedPrimarySelected: {
        backgroundColor: !darkMode
          ? colors.createPrimaryColor({ alpha: 0.04 })
          : changeColorHsla(colors.primary.light, { alpha: 0.04 }),
        border: `${pxToRem(1)} solid ${
          !darkMode ? colors.primary.origin : colors.primary.light
        }`,
        color: !darkMode ? colors.primary.origin : colors.primary.light,
        "& $icon": {
          color: !darkMode ? colors.primary.origin : colors.primary.light
        },
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.12 })
            : changeColorHsla(colors.primary.light, { alpha: 0.12 }),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.24 })
            : changeColorHsla(colors.primary.light, { alpha: 0.24 })
        },
        "&$disabled": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.12 })
            : changeColorHsla(colors.primary.light, { alpha: 0.12 }),
          color: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.32 })
            : changeColorHsla(colors.primary.light, { alpha: 0.32 }),
          "& $icon": {
            color: !darkMode
              ? colors.createPrimaryColor({ alpha: 0.32 })
              : changeColorHsla(colors.primary.light, { alpha: 0.32 })
          },
          borderColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.12 })
            : changeColorHsla(colors.primary.light, { alpha: 0.12 })
        }
      },
      outlinedSecondarySelected: {
        backgroundColor: !darkMode
          ? colors.createSecondaryColor({ alpha: 0.04 })
          : changeColorHsla(colors.secondary.light, { alpha: 0.04 }),
        border: `${pxToRem(1)} solid ${
          !darkMode ? colors.secondary.origin : colors.secondary.light
        }`,
        color: !darkMode ? colors.secondary.origin : colors.secondary.light,
        "& $icon": {
          color: !darkMode ? colors.secondary.origin : colors.secondary.light
        },
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createSecondaryColor({ alpha: 0.12 })
            : changeColorHsla(colors.secondary.light, { alpha: 0.12 }),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createSecondaryColor({ alpha: 0.24 })
            : changeColorHsla(colors.secondary.light, { alpha: 0.24 })
        },
        "&$disabled": {
          backgroundColor: !darkMode
            ? colors.createSecondaryColor({ alpha: 0.12 })
            : changeColorHsla(colors.secondary.light, { alpha: 0.12 }),
          color: !darkMode
            ? colors.createSecondaryColor({ alpha: 0.32 })
            : changeColorHsla(colors.secondary.light, { alpha: 0.32 }),
          "& $icon": {
            color: !darkMode
              ? colors.createSecondaryColor({ alpha: 0.32 })
              : changeColorHsla(colors.secondary.light, { alpha: 0.32 })
          },
          borderColor: !darkMode
            ? colors.createSecondaryColor({ alpha: 0.12 })
            : changeColorHsla(colors.secondary.light, { alpha: 0.12 })
        }
      },
      focusVisible: {
        outline: `2px solid ${darkMode ? blue[300] : blue[500]}`,
        outlineOffset: 1
      }
    };
  },
  { name: "SonnatChoiceChip" }
);

export default useStyles;
