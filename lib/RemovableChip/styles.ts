import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      radius,
      spacings: { spaces },
      swatches: { grey, blue },
      mixins: { asIconWrapper, disableUserSelect },
      typography: { pxToRem, setText, fontFamily }
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
        disabled: !darkMode ? grey[50] : grey[900]
      },
      text: colors.text.secondary
    };

    const filledPrimary = {
      background: {
        main: colors.createPrimaryColor({ alpha: 0.08 }, true),
        disabled: colors.createPrimaryColor({ alpha: 0.12 }, true)
      },
      text: filledPrimaryMainBg
    };

    const filledSecondary = {
      background: {
        main: colors.createSecondaryColor({ alpha: 0.08 }, true),
        disabled: colors.createSecondaryColor({ alpha: 0.12 }, true)
      },
      text: filledSecondaryMainBg
    };

    return {
      root: {
        ...setText(),
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
        minWidth: pxToRem(16),
        minHeight: pxToRem(16),
        fontSize: pxToRem(16),
        transition: "background-color 360ms ease, color 360ms ease"
      },
      small: {
        height: pxToRem(20),
        fontSize: pxToRem(10),
        padding: `0 ${spaces[3].rem}`,
        lineHeight: 1.8,
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
        fontSize: pxToRem(12),
        lineHeight: 1.6666666667,
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
        fontSize: pxToRem(14),
        lineHeight: 1.5714285714,
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
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.32 }, true)
            : colors.createWhiteColor({ alpha: 0.24 }, true),
          "& $icon, & $removeButtonIcon": {
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
        "& $icon, & $removeButtonIcon": { color: filledDefault.text },
        "& $removeButton": {
          "&:hover > $removeButtonIcon": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.12 })
              : colors.createWhiteColor({ alpha: 0.12 }),
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          },
          "&:active > $removeButtonIcon": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.24 })
              : colors.createWhiteColor({ alpha: 0.24 })
          }
        },
        "&$disabled": {
          color: !darkMode
            ? colors.createBlackColor({ alpha: 0.32 }, true)
            : colors.createWhiteColor({ alpha: 0.32 }, true),
          "& $icon, & $removeButtonIcon": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 }, true)
              : colors.createWhiteColor({ alpha: 0.32 }, true)
          },
          backgroundColor: filledDefault.background.disabled
        }
      },
      filledPrimary: {
        backgroundColor: filledPrimary.background.main,
        color: filledPrimary.text,
        "& $icon, & $removeButtonIcon": { color: filledPrimary.text },
        "& $removeButton": {
          "&:hover > $removeButtonIcon": {
            backgroundColor: colors.createPrimaryColor({ alpha: 0.12 }),
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          },
          "&:active > $removeButtonIcon": {
            backgroundColor: colors.createPrimaryColor({ alpha: 0.24 })
          }
        },
        "&$disabled": { backgroundColor: filledPrimary.background.disabled }
      },
      filledSecondary: {
        backgroundColor: filledSecondary.background.main,
        color: filledSecondary.text,
        "& $icon, & $removeButtonIcon": { color: filledSecondary.text },
        "& $removeButton": {
          "&:hover > $removeButtonIcon": {
            backgroundColor: colors.createSecondaryColor({ alpha: 0.12 }),
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          },
          "&:active > $removeButtonIcon": {
            backgroundColor: colors.createSecondaryColor({ alpha: 0.24 })
          }
        },
        "&$disabled": { backgroundColor: filledSecondary.background.disabled }
      },
      outlinedDefault: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 }, true)
          : colors.createWhiteColor({ alpha: 0.04 }, true),
        border: `1px solid ${
          !darkMode
            ? colors.createBlackColor({ alpha: 0.64 }, true)
            : colors.createWhiteColor({ alpha: 0.64 }, true)
        }`,
        color: colors.text.secondary,
        "& $icon, & $removeButtonIcon": { color: colors.text.secondary },
        "& $removeButton": {
          "&:hover > $removeButtonIcon": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.12 })
              : colors.createWhiteColor({ alpha: 0.12 }),
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          },
          "&:active > $removeButtonIcon": {
            backgroundColor: !darkMode
              ? colors.createBlackColor({ alpha: 0.24 })
              : colors.createWhiteColor({ alpha: 0.24 })
          }
        },
        "&$disabled, &[disabled]": {
          borderColor: colors.divider,
          color: colors.text.disabled,
          "& $icon, & $removeButtonIcon": { color: colors.text.disabled }
        }
      },
      outlinedPrimary: {
        backgroundColor: colors.createPrimaryColor({ alpha: 0.08 }, true),
        border: `1px solid ${filledPrimaryMainBg}`,
        color: filledPrimaryMainBg,
        "& $icon, & $removeButtonIcon": { color: filledPrimaryMainBg },
        "& $removeButton": {
          "&:hover > $removeButtonIcon": {
            backgroundColor: colors.createPrimaryColor({ alpha: 0.12 }),
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          },
          "&:active > $removeButtonIcon": {
            backgroundColor: colors.createPrimaryColor({ alpha: 0.24 })
          }
        },
        "&$disabled": {
          color: colors.createPrimaryColor({ alpha: 0.32 }, true),
          "& $icon, & $removeButtonIcon": {
            color: colors.createPrimaryColor({ alpha: 0.32 }, true)
          },
          borderColor: colors.createPrimaryColor({ alpha: 0.12 }, true)
        }
      },
      outlinedSecondary: {
        backgroundColor: colors.createSecondaryColor({ alpha: 0.04 }, true),
        border: `1px solid ${filledSecondaryMainBg}`,
        color: filledSecondaryMainBg,
        "& $icon, & $removeButtonIcon": { color: filledSecondaryMainBg },
        "& $removeButton": {
          "&:hover > $removeButtonIcon": {
            backgroundColor: colors.createSecondaryColor({ alpha: 0.12 }),
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          },
          "&:active > $removeButtonIcon": {
            backgroundColor: colors.createSecondaryColor({ alpha: 0.24 })
          }
        },
        "&$disabled": {
          color: colors.createSecondaryColor({ alpha: 0.32 }, true),
          "& $icon, & $removeButtonIcon": {
            color: colors.createSecondaryColor({ alpha: 0.32 }, true)
          },
          borderColor: colors.createSecondaryColor({ alpha: 0.12 }, true)
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
