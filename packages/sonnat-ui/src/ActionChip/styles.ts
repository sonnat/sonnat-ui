import { makeStyles, pallete } from "../styles";
import { adjustColor, changeColor } from "../styles/colorUtils";

export type VariantColorCombo =
  | "filledDefault"
  | "filledPrimary"
  | "filledSecondary"
  | "outlinedDefault"
  | "outlinedPrimary"
  | "outlinedSecondary";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      darkMode,
      mixins: { useIconWrapper, useDisableUserSelect },
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    const filledPrimaryMainBg = !darkMode
      ? colors.primary.origin
      : colors.primary.light;
    const filledSecondaryMainBg = !darkMode
      ? colors.secondary.origin
      : colors.secondary.light;

    const filledPrimary = {
      background: {
        main: filledPrimaryMainBg,
        hover: adjustColor(filledPrimaryMainBg, {
          saturation: -8,
          lightness: +8
        }),
        active: adjustColor(filledPrimaryMainBg, {
          saturation: +8,
          lightness: -4
        }),
        disabled: changeColor(filledPrimaryMainBg, { alpha: 0.12 })
      },
      text: colors.getContrastColorOf(filledPrimaryMainBg)
    };

    const filledSecondary = {
      background: {
        main: filledSecondaryMainBg,
        hover: adjustColor(filledSecondaryMainBg, {
          saturation: -8,
          lightness: +8
        }),
        active: adjustColor(filledSecondaryMainBg, {
          saturation: +8,
          lightness: -4
        }),
        disabled: changeColor(filledSecondaryMainBg, { alpha: 0.12 })
      },
      text: colors.getContrastColorOf(filledSecondaryMainBg)
    };

    return {
      root: {
        ...useText(),
        ...useDisableUserSelect(),
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
        ...useIconWrapper(16),
        flexShrink: "0",
        transition: "color 360ms ease"
      },
      small: {
        height: pxToRem(20),
        fontSize: pxToRem(10),
        padding: `0 ${pxToRem(8)}`,
        lineHeight: 1.8,
        "& $icon": {
          ...useIconWrapper(14),
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
      filled: {
        "&$disabled": {
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.32 })
            : colors.createWhiteColor({ alpha: 0.12 }),
          "& $icon": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 })
              : colors.createWhiteColor({ alpha: 0.12 })
          }
        }
      },
      outlined: {
        "&$disabled": {
          backgroundColor: colors.transparent
        }
      },
      filledDefault: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 })
          : colors.createWhiteColor({ alpha: 0.04 }),
        color: colors.text.secondary,
        "& $icon": { color: colors.text.secondary },
        "&$disabled": {
          backgroundColor: !darkMode
            ? colors.pallete.grey[100]
            : colors.pallete.grey[900]
        },
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
      filledPrimary: {
        backgroundColor: filledPrimary.background.main,
        color: filledPrimary.text,
        "& $icon": { color: filledPrimary.text },
        "&$disabled": {
          backgroundColor: filledPrimary.background.disabled
        },
        "&:hover": {
          backgroundColor: filledPrimary.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: filledPrimary.background.active
        }
      },
      filledSecondary: {
        backgroundColor: filledSecondary.background.main,
        color: filledSecondary.text,
        "& $icon": { color: filledSecondary.text },
        "&$disabled": {
          backgroundColor: filledSecondary.background.disabled
        },
        "&:hover": {
          backgroundColor: filledSecondary.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: filledSecondary.background.active
        }
      },
      outlinedDefault: {
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
      outlinedPrimary: {
        backgroundColor: changeColor(filledPrimaryMainBg, { alpha: 0.04 }),
        border: `${pxToRem(1)} solid ${filledPrimaryMainBg}`,
        color: filledPrimaryMainBg,
        "& $icon": { color: filledPrimaryMainBg },
        "&:hover": {
          backgroundColor: changeColor(filledPrimaryMainBg, { alpha: 0.12 }),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: changeColor(filledPrimaryMainBg, { alpha: 0.24 })
        },
        "&$disabled": {
          color: changeColor(filledPrimaryMainBg, { alpha: 0.32 }),
          "& $icon": {
            color: changeColor(filledPrimaryMainBg, { alpha: 0.32 })
          },
          borderColor: changeColor(filledPrimaryMainBg, { alpha: 0.12 })
        }
      },
      outlinedSecondary: {
        backgroundColor: changeColor(filledSecondaryMainBg, { alpha: 0.04 }),
        border: `${pxToRem(1)} solid ${filledSecondaryMainBg}`,
        color: filledSecondaryMainBg,
        "& $icon": {
          color: filledSecondaryMainBg
        },
        "&:hover": {
          backgroundColor: changeColor(filledSecondaryMainBg, { alpha: 0.12 }),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: changeColor(filledSecondaryMainBg, { alpha: 0.24 })
        },
        "&$disabled": {
          color: changeColor(filledSecondaryMainBg, { alpha: 0.32 }),
          "& $icon": {
            color: changeColor(filledSecondaryMainBg, { alpha: 0.32 })
          },
          borderColor: changeColor(filledSecondaryMainBg, { alpha: 0.12 })
        }
      },
      focusVisible: {
        outline: `2px solid ${
          darkMode ? pallete.blue[300] : pallete.blue[500]
        }`,
        outlineOffset: 1
      }
    };
  },
  { name: "SonnatActionChip" }
);

export default useStyles;
