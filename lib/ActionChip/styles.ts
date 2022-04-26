import { createChipsVariantStyles } from "../ChoiceChip/styles";
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
      direction,
      darkMode,
      radius,
      colors,
      spacings: { spaces },
      swatches: { blue },
      mixins: { asIconWrapper, disableUserSelect },
      typography: { pxToRem, fontFamily, variants }
    } = theme;

    const {
      filledDefaultUnselected,
      filledPrimaryUnselected,
      filledSecondaryUnselected,
      outlinedDefaultUnselected,
      outlinedPrimaryUnselected,
      outlinedSecondaryUnselected
    } = createChipsVariantStyles(theme);

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
          color: filledDefaultUnselected.text.disabled,
          "& $icon": { color: filledDefaultUnselected.text.disabled }
        }
      },
      outlined: { "&$disabled": { backgroundColor: colors.transparent } },
      filledDefault: {
        backgroundColor: filledDefaultUnselected.background.main,
        color: filledDefaultUnselected.text.main,
        "& $icon": { color: filledDefaultUnselected.text.main },
        "&$disabled": {
          color: filledDefaultUnselected.text.disabled,
          "& $icon": { color: filledDefaultUnselected.text.disabled },
          backgroundColor: filledDefaultUnselected.background.disabled
        },
        "&:hover": {
          backgroundColor: filledDefaultUnselected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledDefaultUnselected.background.active
        }
      },
      filledPrimary: {
        backgroundColor: filledPrimaryUnselected.background.main,
        color: filledPrimaryUnselected.text.main,
        "& $icon": { color: filledPrimaryUnselected.text.main },
        "&$disabled": {
          backgroundColor: filledPrimaryUnselected.background.disabled
        },
        "&:hover": {
          backgroundColor: filledPrimaryUnselected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledPrimaryUnselected.background.active
        }
      },
      filledSecondary: {
        backgroundColor: filledSecondaryUnselected.background.main,
        color: filledSecondaryUnselected.text.main,
        "& $icon": { color: filledSecondaryUnselected.text.main },
        "&$disabled": {
          backgroundColor: filledSecondaryUnselected.background.disabled
        },
        "&:hover": {
          backgroundColor: filledSecondaryUnselected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledSecondaryUnselected.background.active
        }
      },
      outlinedDefault: {
        backgroundColor: outlinedDefaultUnselected.background.main,
        border: `1px solid ${outlinedDefaultUnselected.border.main}`,
        color: outlinedDefaultUnselected.text.main,
        "& $icon": { color: outlinedDefaultUnselected.text.main },
        "&:hover": {
          backgroundColor: outlinedDefaultUnselected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: outlinedDefaultUnselected.background.active
        },
        "&$disabled": {
          borderColor: outlinedDefaultUnselected.border.disabled,
          color: outlinedDefaultUnselected.text.disabled,
          "& $icon": { color: outlinedDefaultUnselected.text.disabled }
        }
      },
      outlinedPrimary: {
        backgroundColor: outlinedPrimaryUnselected.background.main,
        border: `1px solid ${outlinedPrimaryUnselected.border.main}`,
        color: outlinedPrimaryUnselected.text.main,
        "& $icon": { color: outlinedPrimaryUnselected.text.main },
        "&:hover": {
          backgroundColor: outlinedPrimaryUnselected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: outlinedPrimaryUnselected.background.active
        },
        "&$disabled": {
          color: outlinedPrimaryUnselected.text.disabled,
          "& $icon": { color: outlinedPrimaryUnselected.text.disabled },
          borderColor: outlinedPrimaryUnselected.border.disabled
        }
      },
      outlinedSecondary: {
        backgroundColor: outlinedSecondaryUnselected.background.main,
        border: `1px solid ${outlinedSecondaryUnselected.border.main}`,
        color: outlinedSecondaryUnselected.text.main,
        "& $icon": { color: outlinedSecondaryUnselected.text.main },
        "&:hover": {
          backgroundColor: outlinedSecondaryUnselected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: outlinedSecondaryUnselected.background.active
        },
        "&$disabled": {
          color: outlinedSecondaryUnselected.text.disabled,
          "& $icon": { color: outlinedSecondaryUnselected.text.disabled },
          borderColor: outlinedSecondaryUnselected.background.disabled
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
