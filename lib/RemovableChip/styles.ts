import { createChipsVariantStyles } from "../ChoiceChip/styles";
import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      direction,
      radius,
      spacings: { spaces },
      swatches: { blue },
      colors: { text, ...colors },
      mixins: { asIconWrapper, disableUserSelect },
      typography: { pxToRem, variants, fontFamily }
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
        ...variants.body,
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
        position: "relative",
        zIndex: "1",
        flexShrink: "0",
        transition:
          "color 360ms ease, background-color 360ms ease, border 360ms ease"
      },
      icon: {
        ...asIconWrapper(16),
        flexShrink: "0",
        transition: "color 360ms ease"
      },
      removeButton: {
        padding: "0",
        margin: "0",
        outline: "none",
        cursor: "pointer",
        borderRadius: "0",
        border: "none",
        minWidth: "auto",
        height: "100%",
        backgroundColor: colors.transparent,
        zIndex: "2",
        pointerEvents: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: "0",
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(-spaces[5].px) }
          : { marginRight: pxToRem(-spaces[5].px) })
      },
      removeButtonIcon: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.transparent,
        borderRadius: radius.rounded,
        cursor: "pointer",
        width: pxToRem(16),
        height: pxToRem(16),
        transition: "background-color 360ms ease, color 360ms ease"
      },
      small: {
        height: pxToRem(20),
        fontSize: variants.captionSmall.fontSize,
        lineHeight: variants.captionSmall.lineHeight,
        padding: `0 ${spaces[3].rem}`,
        "& $removeButton": {
          width: pxToRem(20),
          ...(direction === "rtl"
            ? { marginLeft: pxToRem(-spaces[3].px) }
            : { marginRight: pxToRem(-spaces[3].px) })
        },
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
        height: pxToRem(28),
        fontSize: variants.caption.fontSize,
        lineHeight: variants.caption.lineHeight,
        "& $removeButton": { width: pxToRem(28) },
        "& $icon": {
          ...(direction === "rtl"
            ? {
                marginRight: pxToRem(spaces[2].px - spaces[5].px),
                marginLeft: spaces[1].rem
              }
            : {
                marginLeft: pxToRem(spaces[2].px - spaces[5].px),
                marginRight: spaces[1].rem
              })
        }
      },
      large: {
        height: pxToRem(32),
        fontSize: variants.bodySmall.fontSize,
        lineHeight: variants.bodySmall.lineHeight,
        "& $removeButton": { width: pxToRem(32) },
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
        "& $removeButton": { pointerEvents: "none" },
        "& $icon, & $removeButtonIcon": { pointerEvents: "none" },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        }
      },
      filled: {
        "&$disabled": {
          color: filledDefaultUnselected.text.disabled,
          "& $icon, & $removeButtonIcon": {
            color: filledDefaultUnselected.text.disabled
          }
        }
      },
      outlined: { "&$disabled": { backgroundColor: colors.transparent } },
      filledDefault: {
        backgroundColor: filledDefaultUnselected.background.main,
        color: filledDefaultUnselected.text.main,
        "& $icon, & $removeButtonIcon": {
          color: filledDefaultUnselected.text.main
        },
        "& $removeButton": {
          "&:hover > $removeButtonIcon": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
              : colors.createWhiteColor({ alpha: 0.12 }, false, darkMode),
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          },
          "&:active > $removeButtonIcon": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.24 }, false, darkMode)
              : colors.createWhiteColor({ alpha: 0.24 }, false, darkMode)
          }
        },
        "&$disabled": {
          backgroundColor: filledDefaultUnselected.background.disabled
        }
      },
      filledPrimary: {
        backgroundColor: filledPrimaryUnselected.background.main,
        color: filledPrimaryUnselected.text.main,
        "& $icon, & $removeButtonIcon": {
          color: filledPrimaryUnselected.text.main
        },
        "& $removeButton": {
          "&:hover > $removeButtonIcon": {
            backgroundColor: colors.createPrimaryColor(
              { alpha: 0.12 },
              false,
              darkMode
            ),
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          },
          "&:active > $removeButtonIcon": {
            backgroundColor: colors.createPrimaryColor(
              { alpha: 0.24 },
              false,
              darkMode
            )
          }
        },
        "&$disabled": {
          backgroundColor: filledPrimaryUnselected.background.disabled
        }
      },
      filledSecondary: {
        backgroundColor: filledSecondaryUnselected.background.main,
        color: filledSecondaryUnselected.text.main,
        "& $icon, & $removeButtonIcon": {
          color: filledSecondaryUnselected.text.main
        },
        "& $removeButton": {
          "&:hover > $removeButtonIcon": {
            backgroundColor: colors.createSecondaryColor(
              { alpha: 0.12 },
              false,
              darkMode
            ),
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          },
          "&:active > $removeButtonIcon": {
            backgroundColor: colors.createSecondaryColor(
              { alpha: 0.24 },
              false,
              darkMode
            )
          }
        },
        "&$disabled": {
          backgroundColor: filledSecondaryUnselected.background.disabled
        }
      },
      outlinedDefault: {
        backgroundColor: outlinedDefaultUnselected.background.main,
        border: `1px solid ${outlinedDefaultUnselected.border.main}`,
        color: !darkMode ? text.dark.secondary : text.light.secondary,
        "& $icon, & $removeButtonIcon": {
          color: !darkMode ? text.dark.secondary : text.light.secondary
        },
        "& $removeButton": {
          "&:hover > $removeButtonIcon": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
              : colors.createWhiteColor({ alpha: 0.12 }, false, darkMode),
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          },
          "&:active > $removeButtonIcon": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.24 }, false, darkMode)
              : colors.createWhiteColor({ alpha: 0.24 }, false, darkMode)
          }
        },
        "&$disabled": {
          borderColor: outlinedDefaultUnselected.border.disabled,
          color: outlinedDefaultUnselected.text.disabled,
          "& $icon, & $removeButtonIcon": {
            color: outlinedDefaultUnselected.text.disabled
          }
        }
      },
      outlinedPrimary: {
        backgroundColor: outlinedPrimaryUnselected.background.main,
        border: `1px solid ${outlinedPrimaryUnselected.border.main}`,
        color: outlinedPrimaryUnselected.text.main,
        "& $icon, & $removeButtonIcon": {
          color: outlinedPrimaryUnselected.text.main
        },
        "& $removeButton": {
          "&:hover > $removeButtonIcon": {
            backgroundColor: colors.createPrimaryColor(
              { alpha: 0.12 },
              false,
              darkMode
            ),
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          },
          "&:active > $removeButtonIcon": {
            backgroundColor: colors.createPrimaryColor(
              { alpha: 0.24 },
              false,
              darkMode
            )
          }
        },
        "&$disabled": {
          color: outlinedPrimaryUnselected.text.disabled,
          "& $icon, & $removeButtonIcon": {
            color: outlinedPrimaryUnselected.text.disabled
          },
          borderColor: outlinedPrimaryUnselected.border.disabled
        }
      },
      outlinedSecondary: {
        backgroundColor: outlinedSecondaryUnselected.background.main,
        border: `1px solid ${outlinedSecondaryUnselected.border.main}`,
        color: outlinedSecondaryUnselected.text.main,
        "& $icon, & $removeButtonIcon": {
          color: outlinedSecondaryUnselected.text.main
        },
        "& $removeButton": {
          "&:hover > $removeButtonIcon": {
            backgroundColor: colors.createSecondaryColor(
              { alpha: 0.12 },
              false,
              darkMode
            ),
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          },
          "&:active > $removeButtonIcon": {
            backgroundColor: colors.createSecondaryColor(
              { alpha: 0.24 },
              false,
              darkMode
            )
          }
        },
        "&$disabled": {
          color: outlinedSecondaryUnselected.text.disabled,
          "& $icon, & $removeButtonIcon": {
            color: outlinedSecondaryUnselected.text.disabled
          },
          borderColor: outlinedSecondaryUnselected.border.disabled
        }
      },
      focusVisible: {
        outline: `2px solid ${darkMode ? blue[500] : blue[600]}`,
        outlineOffset: 1
      }
    };
  },
  { name: "SonnatRemovableChip" }
);

export default useStyles;
