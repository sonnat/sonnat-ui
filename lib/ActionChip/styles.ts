import makeStyles from "../styles/makeStyles";

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
      radius,
      spacings: { spaces },
      swatches: { blue, grey },
      mixins: { asIconWrapper, disableUserSelect },
      typography: { pxToRem, fontFamily, variants }
    } = theme;

    const filledPrimaryMainBg = !darkMode
      ? colors.primary.origin
      : colors.primary.light;
    const filledSecondaryMainBg = !darkMode
      ? colors.secondary.origin
      : colors.secondary.light;

    const filledDefault = {
      background: {
        main: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 }, true)
          : colors.createWhiteColor({ alpha: 0.04 }, true),
        hover: !darkMode
          ? colors.createBlackColor({ alpha: 0.12 }, true)
          : colors.createWhiteColor({ alpha: 0.12 }, true),
        active: !darkMode
          ? colors.createBlackColor({ alpha: 0.16 }, true)
          : colors.createWhiteColor({ alpha: 0.16 }, true),
        disabled: !darkMode ? grey[50] : grey[900]
      },
      text: colors.text.secondary
    };

    const filledPrimary = {
      background: {
        main: colors.createPrimaryColor({ alpha: 0.08 }, true),
        hover: colors.createPrimaryColor({ alpha: 0.12 }, true),
        active: colors.createPrimaryColor({ alpha: 0.24 }, true),
        disabled: colors.createPrimaryColor({ alpha: 0.12 }, true)
      },
      text: filledPrimaryMainBg
    };

    const filledSecondary = {
      background: {
        main: colors.createSecondaryColor({ alpha: 0.08 }, true),
        hover: colors.createSecondaryColor({ alpha: 0.12 }, true),
        active: colors.createSecondaryColor({ alpha: 0.24 }, true),
        disabled: colors.createSecondaryColor({ alpha: 0.12 }, true)
      },
      text: filledSecondaryMainBg
    };

    const outlinedDefault = {
      border: {
        main: !darkMode
          ? colors.createBlackColor({ alpha: 0.64 }, true)
          : colors.createWhiteColor({ alpha: 0.64 }, true),
        disabled: colors.divider
      },
      background: {
        main: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 }, true)
          : colors.createWhiteColor({ alpha: 0.04 }, true),
        hover: !darkMode
          ? colors.createBlackColor({ alpha: 0.08 }, true)
          : colors.createWhiteColor({ alpha: 0.08 }, true),
        active: !darkMode
          ? colors.createBlackColor({ alpha: 0.12 }, true)
          : colors.createWhiteColor({ alpha: 0.12 }, true),
        disabled: colors.transparent
      },
      text: {
        main: colors.text.secondary,
        disabled: colors.text.disabled
      }
    };

    const outlinedPrimary = {
      border: {
        main: filledPrimaryMainBg,
        disabled: colors.createPrimaryColor({ alpha: 0.12 }, true)
      },
      background: {
        main: colors.createPrimaryColor({ alpha: 0.08 }, true),
        hover: colors.createPrimaryColor({ alpha: 0.12 }, true),
        active: colors.createPrimaryColor({ alpha: 0.24 }, true),
        disabled: colors.createPrimaryColor({ alpha: 0.12 }, true)
      },
      text: {
        main: filledPrimaryMainBg,
        disabled: colors.createPrimaryColor({ alpha: 0.32 }, true)
      }
    };

    const outlinedSecondary = {
      border: {
        main: filledSecondaryMainBg,
        disabled: colors.createSecondaryColor({ alpha: 0.12 }, true)
      },
      background: {
        main: colors.createSecondaryColor({ alpha: 0.08 }, true),
        hover: colors.createSecondaryColor({ alpha: 0.12 }, true),
        active: colors.createSecondaryColor({ alpha: 0.24 }, true),
        disabled: colors.createSecondaryColor({ alpha: 0.12 }, true)
      },
      text: {
        main: filledSecondaryMainBg,
        disabled: colors.createSecondaryColor({ alpha: 0.32 }, true)
      }
    };

    return {
      root: {
        ...disableUserSelect(),
        direction,
        fontFamily: fontFamily[direction],
        padding: `0 ${spaces[5].rem}`,
        outline: "none",
        display: "inline-flex",
        alignItems: "center",
        alignSelf: "center",
        borderRadius: radius.xSmall,
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
        ...variants.captionSmall,
        height: pxToRem(20),
        padding: `0 ${spaces[3].rem}`,
        "& $icon": {
          ...asIconWrapper(14),
          ...(direction === "rtl"
            ? {
                marginRight: pxToRem(spaces[2].px - spaces[3].px),
                marginLeft: spaces[1].rem
              }
            : {
                marginLeft: pxToRem(spaces[2].px - spaces[3].px),
                marginRight: spaces[1].rem
              })
        }
      },
      medium: {
        ...variants.caption,
        height: pxToRem(28),
        "& $icon": {
          ...(direction === "rtl"
            ? {
                marginRight: pxToRem(spaces[2].px - spaces[5].px),
                marginLeft: spaces[1].rem
              }
            : {
                marginLeft: pxToRem(spaces[2].px - spaces[3].px),
                marginRight: spaces[1].rem
              })
        }
      },
      large: {
        ...variants.bodySmall,
        height: pxToRem(32),
        "& $icon": {
          ...(direction === "rtl"
            ? {
                marginRight: pxToRem(spaces[3].px - spaces[5].px),
                marginLeft: spaces[1].rem
              }
            : {
                marginLeft: pxToRem(spaces[3].px - spaces[5].px),
                marginRight: spaces[1].rem
              })
        }
      },
      rounded: { borderRadius: radius.rounded },
      disabled: {
        pointerEvents: "none",
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        }
      },
      filled: {
        "&$disabled": {
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.32 }, true)
            : colors.createWhiteColor({ alpha: 0.24 }, true),
          "& $icon": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 }, true)
              : colors.createWhiteColor({ alpha: 0.24 }, true)
          }
        }
      },
      outlined: { "&$disabled": { backgroundColor: colors.transparent } },
      filledDefault: {
        backgroundColor: filledDefault.background.main,
        color: filledDefault.text,
        "& $icon": { color: filledDefault.text },
        "&$disabled": {
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.32 }, true)
            : colors.createWhiteColor({ alpha: 0.32 }, true),
          "& $icon": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 }, true)
              : colors.createWhiteColor({ alpha: 0.32 }, true)
          },
          backgroundColor: filledDefault.background.disabled
        },
        "&:hover": {
          backgroundColor: filledDefault.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": { backgroundColor: filledDefault.background.active }
      },
      filledPrimary: {
        backgroundColor: filledPrimary.background.main,
        color: filledPrimary.text,
        "& $icon": { color: filledPrimary.text },
        "&$disabled": { backgroundColor: filledPrimary.background.disabled },
        "&:hover": {
          backgroundColor: filledPrimary.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": { backgroundColor: filledPrimary.background.active }
      },
      filledSecondary: {
        backgroundColor: filledSecondary.background.main,
        color: filledSecondary.text,
        "& $icon": { color: filledSecondary.text },
        "&$disabled": { backgroundColor: filledSecondary.background.disabled },
        "&:hover": {
          backgroundColor: filledSecondary.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": { backgroundColor: filledSecondary.background.active }
      },
      outlinedDefault: {
        backgroundColor: outlinedDefault.background.main,
        border: `1px solid ${outlinedDefault.border.main}`,
        color: outlinedDefault.text.main,
        "& $icon": { color: colors.text.secondary },
        "&:hover": {
          backgroundColor: outlinedDefault.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": { backgroundColor: outlinedDefault.background.active },
        "&$disabled": {
          borderColor: outlinedDefault.border.disabled,
          color: outlinedDefault.text.disabled,
          "& $icon": { color: outlinedDefault.text.disabled }
        }
      },
      outlinedPrimary: {
        backgroundColor: outlinedPrimary.background.main,
        border: `1px solid ${outlinedPrimary.border.main}`,
        color: outlinedPrimary.text.main,
        "& $icon": { color: outlinedPrimary.text.main },
        "&:hover": {
          backgroundColor: outlinedPrimary.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": { backgroundColor: outlinedPrimary.background.active },
        "&$disabled": {
          color: outlinedPrimary.text.disabled,
          "& $icon": { color: outlinedPrimary.text.disabled },
          borderColor: outlinedPrimary.border.disabled
        }
      },
      outlinedSecondary: {
        backgroundColor: outlinedSecondary.background.main,
        border: `1px solid ${outlinedSecondary.border.main}`,
        color: outlinedSecondary.text.main,
        "& $icon": { color: outlinedSecondary.text.main },
        "&:hover": {
          backgroundColor: outlinedSecondary.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": { backgroundColor: outlinedSecondary.background.active },
        "&$disabled": {
          color: outlinedSecondary.text.disabled,
          "& $icon": { color: outlinedSecondary.text.disabled },
          borderColor: outlinedSecondary.background.disabled
        }
      },
      focusVisible: {
        outline: `2px solid ${darkMode ? blue[500] : blue[600]}`,
        outlineOffset: 1
      }
    };
  },
  { name: "SonnatActionChip" }
);

export default useStyles;
