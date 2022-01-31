import { lighten, darken } from "../styles/colorUtils";
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
      darkMode,
      direction,
      radius,
      spacings: { spaces },
      swatches: { blue },
      colors: { text, divider, ...colors },
      mixins: { asIconWrapper, disableUserSelect },
      typography: { pxToRem, variants, fontFamily }
    } = theme;

    const filledDefaultMainBg = !darkMode
      ? text.dark.secondary
      : text.light.secondary;
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
          ? colors.createBlackColor({ alpha: 0.48 }, true, darkMode)
          : colors.createWhiteColor({ alpha: 0.87 }, true, darkMode),
        active: !darkMode
          ? colors.createBlackColor({ alpha: 0.64 }, true, darkMode)
          : colors.createWhiteColor({ alpha: 0.56 }, true, darkMode),
        disabled: !darkMode
          ? colors.createBlackColor({ alpha: 0.12 }, true, darkMode)
          : colors.createWhiteColor({ alpha: 0.12 }, true, darkMode)
      },
      text: colors.getContrastColorOf(filledDefaultMainBg)
    };

    const filledPrimarySelected = {
      background: {
        main: filledPrimarySelectedMainBg,
        hover: lighten(filledPrimarySelectedMainBg, 0.15),
        active: darken(filledPrimarySelectedMainBg, 0.15),
        disabled: colors.createPrimaryColor({ alpha: 0.12 }, true, darkMode)
      },
      text: colors.getContrastColorOf(filledPrimarySelectedMainBg)
    };

    const filledSecondarySelected = {
      background: {
        main: filledSecondarySelectedMainBg,
        hover: lighten(filledSecondarySelectedMainBg, 0.15),
        active: darken(filledSecondarySelectedMainBg, 0.15),
        disabled: colors.createSecondaryColor({ alpha: 0.12 }, true, darkMode)
      },
      text: colors.getContrastColorOf(filledSecondarySelectedMainBg)
    };

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
        fontSize: variants.captionSmall.fontSize,
        lineHeight: variants.captionSmall.lineHeight,
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
        height: pxToRem(28),
        fontSize: variants.caption.fontSize,
        lineHeight: variants.caption.lineHeight,
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
      selected: {},
      filled: {
        "&$disabled": {
          "&:not($selected)": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.12 }, true, darkMode)
              : colors.createWhiteColor({ alpha: 0.12 }, true, darkMode),
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 }, false, darkMode)
              : colors.createWhiteColor({ alpha: 0.16 }, false, darkMode),
            "& $icon": {
              color: !darkMode
                ? colors.createBlackColor({ alpha: 0.32 }, false, darkMode)
                : colors.createWhiteColor({ alpha: 0.16 }, false, darkMode)
            }
          },
          "&$selected": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 }, true, darkMode)
              : colors.createWhiteColor({ alpha: 0.24 }, true, darkMode),
            "& $icon": {
              color: !darkMode
                ? colors.createBlackColor({ alpha: 0.32 }, true, darkMode)
                : colors.createWhiteColor({ alpha: 0.24 }, true, darkMode)
            }
          }
        }
      },
      outlined: {
        "&$disabled": {
          backgroundColor: colors.transparent,
          "&$selected": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 }, true, darkMode)
              : colors.createWhiteColor({ alpha: 0.24 }, true, darkMode),
            "& $icon": {
              color: !darkMode
                ? colors.createBlackColor({ alpha: 0.32 }, true, darkMode)
                : colors.createWhiteColor({ alpha: 0.24 }, true, darkMode)
            }
          }
        }
      },
      filledUnselected: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 }, false, darkMode)
          : colors.createWhiteColor({ alpha: 0.04 }, false, darkMode),
        color: !darkMode ? text.dark.secondary : text.light.secondary,
        "& $icon": {
          color: !darkMode ? text.dark.secondary : text.light.secondary
        },
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.12 }, false, darkMode),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.16 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.16 }, false, darkMode)
        }
      },
      outlinedUnselected: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 }, false, darkMode)
          : colors.createWhiteColor({ alpha: 0.04 }, false, darkMode),
        border: `1px solid ${
          !darkMode
            ? colors.createBlackColor({ alpha: 0.24 }, true, darkMode)
            : colors.createWhiteColor({ alpha: 0.24 }, true, darkMode)
        }`,
        color: !darkMode ? text.dark.secondary : text.light.secondary,
        "& $icon": {
          color: !darkMode ? text.dark.secondary : text.light.secondary
        },
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.08 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.08 }, false, darkMode),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.12 }, false, darkMode)
        },
        "&$disabled": {
          borderColor: !darkMode ? divider.dark : divider.light,
          color: !darkMode ? text.dark.disabled : text.light.disabled,
          "& $icon": {
            color: !darkMode ? text.dark.disabled : text.light.disabled
          }
        }
      },
      filledDefaultSelected: {
        backgroundColor: filledDefault.background.main,
        color: filledDefault.text,
        "& $icon": { color: filledDefault.text },
        "&:hover": {
          backgroundColor: filledDefault.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": { backgroundColor: filledDefault.background.active },
        "&$disabled": {
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.32 }, true, darkMode)
            : colors.createWhiteColor({ alpha: 0.24 }, true, darkMode),
          "& $icon": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 }, true, darkMode)
              : colors.createWhiteColor({ alpha: 0.24 }, true, darkMode)
          },
          backgroundColor: filledDefault.background.disabled
        }
      },
      filledPrimarySelected: {
        backgroundColor: filledPrimarySelected.background.main,
        color: filledPrimarySelected.text,
        "& $icon": { color: filledPrimarySelected.text },
        "&:hover": {
          backgroundColor: filledPrimarySelected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledPrimarySelected.background.active
        },
        "&$disabled": {
          backgroundColor: filledPrimarySelected.background.disabled
        }
      },
      filledSecondarySelected: {
        backgroundColor: filledSecondarySelected.background.main,
        color: filledSecondarySelected.text,
        "& $icon": { color: filledSecondarySelected.text },
        "&:hover": {
          backgroundColor: filledSecondarySelected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledSecondarySelected.background.active
        },
        "&$disabled": {
          backgroundColor: filledSecondarySelected.background.disabled
        }
      },
      outlinedDefaultSelected: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
          : colors.createWhiteColor({ alpha: 0.12 }, false, darkMode),
        border: `1px solid ${
          !darkMode
            ? colors.createBlackColor({ alpha: 0.48 }, true, darkMode)
            : colors.createWhiteColor({ alpha: 0.48 }, true, darkMode)
        }`,
        color: !darkMode ? text.dark.secondary : text.light.secondary,
        "& $icon": {
          color: !darkMode ? text.dark.secondary : text.light.secondary
        },
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.16 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.16 }, false, darkMode),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.24 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.24 }, false, darkMode)
        },
        "&$disabled": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
            : colors.createWhiteColor({ alpha: 0.12 }, false, darkMode),
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.32 }, true, darkMode)
            : colors.createWhiteColor({ alpha: 0.32 }, true, darkMode),
          "& $icon": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 }, true, darkMode)
              : colors.createWhiteColor({ alpha: 0.32 }, true, darkMode)
          },
          borderColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 }, true, darkMode)
            : colors.createWhiteColor({ alpha: 0.16 }, true, darkMode)
        }
      },
      outlinedPrimarySelected: {
        backgroundColor: colors.createPrimaryColor(
          { alpha: 0.08 },
          false,
          darkMode
        ),
        border: `1px solid ${filledPrimarySelectedMainBg}`,
        color: filledPrimarySelectedMainBg,
        "& $icon": { color: filledPrimarySelectedMainBg },
        "&:hover": {
          backgroundColor: colors.createPrimaryColor(
            { alpha: 0.12 },
            false,
            darkMode
          ),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: colors.createPrimaryColor(
            { alpha: 0.24 },
            false,
            darkMode
          )
        },
        "&$disabled": {
          backgroundColor: colors.createPrimaryColor(
            { alpha: 0.12 },
            false,
            darkMode
          ),
          borderColor: colors.createPrimaryColor(
            { alpha: 0.12 },
            true,
            darkMode
          )
        }
      },
      outlinedSecondarySelected: {
        backgroundColor: colors.createSecondaryColor(
          { alpha: 0.08 },
          false,
          darkMode
        ),
        border: `1px solid ${filledSecondarySelectedMainBg}`,
        color: filledSecondarySelectedMainBg,
        "& $icon": { color: filledSecondarySelectedMainBg },
        "&:hover": {
          backgroundColor: colors.createSecondaryColor(
            { alpha: 0.12 },
            false,
            darkMode
          ),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: colors.createSecondaryColor(
            { alpha: 0.24 },
            false,
            darkMode
          )
        },
        "&$disabled": {
          backgroundColor: colors.createSecondaryColor(
            { alpha: 0.12 },
            false,
            darkMode
          ),
          borderColor: colors.createSecondaryColor(
            { alpha: 0.12 },
            true,
            darkMode
          )
        }
      },
      focusVisible: {
        outline: `2px solid ${darkMode ? blue[500] : blue[600]}`,
        outlineOffset: 1
      }
    };
  },
  { name: "SonnatChoiceChip" }
);

export default useStyles;
