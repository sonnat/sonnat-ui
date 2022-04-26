import { makeStyles, type DefaultTheme } from "../styles";
import { darken, lighten } from "../styles/colorUtils";

export type VariantColorSelectionCombo =
  | "filledDefaultSelected"
  | "filledPrimarySelected"
  | "filledSecondarySelected"
  | "outlinedDefaultSelected"
  | "outlinedPrimarySelected"
  | "outlinedSecondarySelected";

export type VariantUnselectionCombo =
  | "filledDefaultUnselected"
  | "filledPrimaryUnselected"
  | "filledSecondaryUnselected"
  | "outlinedDefaultUnselected"
  | "outlinedPrimaryUnselected"
  | "outlinedSecondaryUnselected";

export const createChipsVariantStyles = (theme: DefaultTheme) => {
  const {
    darkMode,
    colors: { text, divider, ...colors }
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

  const filledDefaultUnselected = {
    background: {
      main: !darkMode
        ? colors.createBlackColor({ alpha: 0.04 }, false, darkMode)
        : colors.createWhiteColor({ alpha: 0.04 }, false, darkMode),
      hover: !darkMode
        ? colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
        : colors.createWhiteColor({ alpha: 0.12 }, false, darkMode),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.16 }, false, darkMode)
        : colors.createWhiteColor({ alpha: 0.16 }, false, darkMode),
      disabled: !darkMode
        ? colors.createBlackColor({ alpha: 0.04 }, false, darkMode)
        : colors.createWhiteColor({ alpha: 0.04 }, false, darkMode)
    },
    text: {
      main: !darkMode ? text.dark.secondary : text.light.secondary,
      disabled: !darkMode ? text.dark.disabled : text.light.disabled
    }
  };
  const filledDefaultSelected = {
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
    text: {
      main: colors.getContrastColorOf(filledDefaultMainBg),
      disabled: !darkMode
        ? colors.createBlackColor({ alpha: 0.32 }, true, darkMode)
        : colors.createWhiteColor({ alpha: 0.24 }, true, darkMode)
    }
  };

  const filledPrimaryUnselected = {
    background: {
      main: colors.createPrimaryColor({ alpha: 0.08 }, false, darkMode),
      hover: colors.createPrimaryColor({ alpha: 0.12 }, false, darkMode),
      active: colors.createPrimaryColor({ alpha: 0.24 }, false, darkMode),
      disabled: colors.createPrimaryColor({ alpha: 0.04 }, false, darkMode)
    },
    text: {
      main: filledPrimarySelectedMainBg,
      disabled: colors.createPrimaryColor({ alpha: 0.32 }, true, darkMode)
    }
  };
  const filledPrimarySelected = {
    background: {
      main: filledPrimarySelectedMainBg,
      hover: lighten(filledPrimarySelectedMainBg, 0.15),
      active: darken(filledPrimarySelectedMainBg, 0.15),
      disabled: colors.createPrimaryColor({ alpha: 0.12 }, true, darkMode)
    },
    text: {
      main: colors.getContrastColorOf(filledPrimarySelectedMainBg),
      disabled: filledDefaultSelected.text.disabled
    }
  };

  const filledSecondaryUnselected = {
    background: {
      main: colors.createSecondaryColor({ alpha: 0.08 }, false, darkMode),
      hover: colors.createSecondaryColor({ alpha: 0.12 }, false, darkMode),
      active: colors.createSecondaryColor({ alpha: 0.24 }, false, darkMode),
      disabled: colors.createSecondaryColor({ alpha: 0.04 }, false, darkMode)
    },
    text: {
      main: filledSecondarySelectedMainBg,
      disabled: colors.createSecondaryColor({ alpha: 0.32 }, true, darkMode)
    }
  };
  const filledSecondarySelected = {
    background: {
      main: filledSecondarySelectedMainBg,
      hover: lighten(filledSecondarySelectedMainBg, 0.15),
      active: darken(filledSecondarySelectedMainBg, 0.15),
      disabled: colors.createSecondaryColor({ alpha: 0.12 }, true, darkMode)
    },
    text: {
      main: colors.getContrastColorOf(filledSecondarySelectedMainBg),
      disabled: filledDefaultSelected.text.disabled
    }
  };

  const outlinedDefaultUnselected = {
    background: {
      main: !darkMode
        ? colors.createBlackColor({ alpha: 0.04 }, false, darkMode)
        : colors.createWhiteColor({ alpha: 0.04 }, false, darkMode),
      hover: !darkMode
        ? colors.createBlackColor({ alpha: 0.08 }, false, darkMode)
        : colors.createWhiteColor({ alpha: 0.08 }, false, darkMode),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
        : colors.createWhiteColor({ alpha: 0.12 }, false, darkMode),
      disabled: colors.transparent
    },
    border: {
      main: !darkMode
        ? colors.createBlackColor({ alpha: 0.64 }, true, darkMode)
        : colors.createWhiteColor({ alpha: 0.64 }, true, darkMode),
      disabled: !darkMode ? divider.dark : divider.light
    },
    text: {
      main: !darkMode ? text.dark.secondary : text.light.secondary,
      disabled: !darkMode ? text.dark.disabled : text.light.disabled
    }
  };

  const outlinedPrimaryUnselected = {
    background: {
      main: colors.createPrimaryColor({ alpha: 0.08 }, false, darkMode),
      hover: colors.createPrimaryColor({ alpha: 0.12 }, false, darkMode),
      active: colors.createPrimaryColor({ alpha: 0.24 }, false, darkMode),
      disabled: colors.transparent
    },
    border: {
      main: filledPrimarySelectedMainBg,
      disabled: colors.createPrimaryColor({ alpha: 0.12 }, true, darkMode)
    },
    text: {
      main: filledPrimarySelectedMainBg,
      disabled: colors.createPrimaryColor({ alpha: 0.32 }, true, darkMode)
    }
  };

  const outlinedSecondaryUnselected = {
    background: {
      main: colors.createSecondaryColor({ alpha: 0.08 }, false, darkMode),
      hover: colors.createSecondaryColor({ alpha: 0.12 }, false, darkMode),
      active: colors.createSecondaryColor({ alpha: 0.24 }, false, darkMode),
      disabled: colors.transparent
    },
    border: {
      main: filledSecondarySelectedMainBg,
      disabled: colors.createSecondaryColor({ alpha: 0.12 }, true, darkMode)
    },
    text: {
      main: filledSecondarySelectedMainBg,
      disabled: colors.createSecondaryColor({ alpha: 0.32 }, true, darkMode)
    }
  };

  return {
    filledDefaultUnselected,
    filledDefaultSelected,
    filledPrimaryUnselected,
    filledPrimarySelected,
    filledSecondaryUnselected,
    filledSecondarySelected,
    outlinedDefaultUnselected,
    outlinedPrimaryUnselected,
    outlinedSecondaryUnselected
  };
};

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      direction,
      radius,
      colors,
      spacings: { spaces },
      swatches: { blue },
      mixins: { asIconWrapper, disableUserSelect },
      typography: { pxToRem, variants, fontFamily }
    } = theme;

    const {
      filledDefaultSelected,
      filledDefaultUnselected,
      filledPrimarySelected,
      filledPrimaryUnselected,
      filledSecondarySelected,
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

      filled: {},
      outlined: {},

      filledDefaultUnselected: {
        backgroundColor: filledDefaultUnselected.background.main,
        color: filledDefaultUnselected.text.main,
        "& $icon": { color: filledDefaultUnselected.text.main },
        "&:hover": {
          backgroundColor: filledDefaultUnselected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledDefaultUnselected.background.active
        },
        "&$disabled": {
          color: filledDefaultUnselected.text.disabled,
          "& $icon": { color: filledDefaultUnselected.text.disabled },
          backgroundColor: filledDefaultUnselected.background.disabled
        }
      },
      filledPrimaryUnselected: {
        backgroundColor: filledPrimaryUnselected.background.main,
        color: filledPrimaryUnselected.text.main,
        "& $icon": { color: filledPrimaryUnselected.text.main },
        "&:hover": {
          backgroundColor: filledPrimaryUnselected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledPrimaryUnselected.background.active
        },
        "&$disabled": {
          color: filledPrimaryUnselected.text.disabled,
          "& $icon": { color: filledPrimaryUnselected.text.disabled },
          backgroundColor: filledPrimaryUnselected.background.disabled
        }
      },
      filledSecondaryUnselected: {
        backgroundColor: filledSecondaryUnselected.background.main,
        color: filledSecondaryUnselected.text.main,
        "& $icon": { color: filledSecondaryUnselected.text.main },
        "&:hover": {
          backgroundColor: filledSecondaryUnselected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledSecondaryUnselected.background.active
        },
        "&$disabled": {
          color: filledSecondaryUnselected.text.disabled,
          "& $icon": { color: filledSecondaryUnselected.text.disabled },
          backgroundColor: filledSecondaryUnselected.background.disabled
        }
      },

      outlinedDefaultUnselected: {
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
          backgroundColor: outlinedDefaultUnselected.background.disabled,
          borderColor: outlinedDefaultUnselected.border.disabled,
          color: outlinedDefaultUnselected.text.disabled,
          "& $icon": { color: outlinedDefaultUnselected.text.disabled }
        }
      },
      outlinedPrimaryUnselected: {
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
          borderColor: outlinedPrimaryUnselected.border.disabled,
          color: outlinedPrimaryUnselected.text.disabled,
          backgroundColor: outlinedPrimaryUnselected.background.disabled,
          "& $icon": { color: outlinedPrimaryUnselected.text.disabled }
        }
      },
      outlinedSecondaryUnselected: {
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
          borderColor: outlinedSecondaryUnselected.border.disabled,
          color: outlinedSecondaryUnselected.text.disabled,
          backgroundColor: outlinedSecondaryUnselected.background.disabled,
          "& $icon": { color: outlinedSecondaryUnselected.text.disabled }
        }
      },

      filledDefaultSelected: {
        backgroundColor: filledDefaultSelected.background.main,
        color: filledDefaultSelected.text.main,
        "& $icon": { color: filledDefaultSelected.text.main },
        "&:hover": {
          backgroundColor: filledDefaultSelected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledDefaultSelected.background.active
        },
        "&$disabled": {
          color: filledDefaultSelected.text.disabled,
          "& $icon": { color: filledDefaultSelected.text.disabled },
          backgroundColor: filledDefaultSelected.background.disabled
        }
      },
      filledPrimarySelected: {
        backgroundColor: filledPrimarySelected.background.main,
        color: filledPrimarySelected.text.main,
        "& $icon": { color: filledPrimarySelected.text.main },
        "&:hover": {
          backgroundColor: filledPrimarySelected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledPrimarySelected.background.active
        },
        "&$disabled": {
          color: filledPrimarySelected.text.disabled,
          "& $icon": { color: filledPrimarySelected.text.disabled },
          backgroundColor: filledPrimarySelected.background.disabled
        }
      },
      filledSecondarySelected: {
        backgroundColor: filledSecondarySelected.background.main,
        color: filledSecondarySelected.text.main,
        "& $icon": { color: filledSecondarySelected.text.main },
        "&:hover": {
          backgroundColor: filledSecondarySelected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledSecondarySelected.background.active
        },
        "&$disabled": {
          color: filledSecondarySelected.text.disabled,
          "& $icon": { color: filledSecondarySelected.text.disabled },
          backgroundColor: filledSecondarySelected.background.disabled
        }
      },

      outlinedDefaultSelected: {
        backgroundColor: filledDefaultSelected.background.main,
        border: `1px solid ${colors.transparent}`,
        color: filledDefaultSelected.text.main,
        "& $icon": { color: filledDefaultSelected.text.main },
        "&:hover": {
          backgroundColor: filledDefaultSelected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledDefaultSelected.background.active
        },
        "&$disabled": {
          color: filledDefaultSelected.text.disabled,
          "& $icon": { color: filledDefaultSelected.text.disabled },
          backgroundColor: filledDefaultSelected.background.disabled
        }
      },
      outlinedPrimarySelected: {
        backgroundColor: filledPrimarySelected.background.main,
        border: `1px solid ${colors.transparent}`,
        color: filledPrimarySelected.text.main,
        "& $icon": { color: filledPrimarySelected.text.main },
        "&:hover": {
          backgroundColor: filledPrimarySelected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledPrimarySelected.background.active
        },
        "&$disabled": {
          color: filledPrimarySelected.text.disabled,
          "& $icon": { color: filledPrimarySelected.text.disabled },
          backgroundColor: filledPrimarySelected.background.disabled
        }
      },
      outlinedSecondarySelected: {
        backgroundColor: filledSecondarySelected.background.main,
        border: `1px solid ${colors.transparent}`,
        color: filledSecondarySelected.text.main,
        "& $icon": { color: filledSecondarySelected.text.main },
        "&:hover": {
          backgroundColor: filledSecondarySelected.background.hover,
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:active": {
          backgroundColor: filledSecondarySelected.background.active
        },
        "&$disabled": {
          color: filledSecondarySelected.text.disabled,
          "& $icon": { color: filledSecondarySelected.text.disabled },
          backgroundColor: filledSecondarySelected.background.disabled
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
