import makeStyles from "../styles/makeStyles";
import createColorVariants from "./createColorVariants";

export type VariantColorCombo =
  | "filledDefault"
  | "filledPrimary"
  | "filledSecondary"
  | "outlinedDefault"
  | "outlinedPrimary"
  | "outlinedSecondary"
  | "inlinedDefault"
  | "inlinedPrimary"
  | "inlinedSecondary";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      darkMode,
      swatches: { blue },
      hacks,
      mixins: { asIconWrapper },
      typography: { pxToRem, setText, fontWeight, fontFamily }
    } = theme;

    const defaultTransitionList = [
      "background-color 360ms ease",
      "transform 360ms ease",
      "box-shadow 400ms ease",
      "border-color 360ms ease"
    ];

    const {
      filledDefault,
      filledPrimary,
      filledSecondary,
      outlinedDefault,
      outlinedPrimary,
      outlinedSecondary,
      inlinedDefault,
      inlinedPrimary,
      inlinedSecondary
    } = createColorVariants(theme);

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        flexShrink: 0,
        appearance: "none !important",
        textDecoration: "none",
        borderRadius: pxToRem(4),
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        border: `1px solid ${colors.transparent}`,
        outline: "none",
        verticalAlign: "middle",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        transition: defaultTransitionList.join(",")
      },
      label: {
        ...setText({ fontWeight: fontWeight.medium }),
        ...hacks.backfaceVisibilityFix,
        flexShrink: 0,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        transition: "color 360ms ease"
      },
      rounded: { borderRadius: pxToRem(24) },
      large: {
        minWidth: pxToRem(96),
        height: pxToRem(40),
        padding: `0 ${pxToRem(16)}`,
        "&$iconButton": {
          height: pxToRem(40),
          width: pxToRem(40),
          "& > $icon": asIconWrapper(20),
          "& > $spinner": { width: pxToRem(20), height: pxToRem(20) }
        },
        "& $label": { fontSize: pxToRem(16), lineHeight: 1.625 },
        "& $icon": asIconWrapper(20),
        "& $spinner": { width: pxToRem(20), height: pxToRem(20) },
        "& $leadingIcon": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(-4), marginLeft: pxToRem(8) }
            : { marginLeft: pxToRem(-4), marginRight: pxToRem(8) })
        },
        "& $trailingIcon": {
          ...(direction === "rtl"
            ? { marginLeft: pxToRem(-4), marginRight: pxToRem(12) }
            : { marginRight: pxToRem(-4), marginLeft: pxToRem(12) })
        }
      },
      medium: {
        minWidth: pxToRem(64),
        height: pxToRem(32),
        padding: `0 ${pxToRem(12)}`,
        "&$iconButton": {
          height: pxToRem(32),
          width: pxToRem(32),
          "& > $icon": asIconWrapper(16),
          "& > $spinner": { width: pxToRem(16), height: pxToRem(16) }
        },
        "& $label": { fontSize: pxToRem(14), lineHeight: 1.5714285714 },
        "& $icon": asIconWrapper(16),
        "& $spinner": { width: pxToRem(16), height: pxToRem(16) },
        "& $leadingIcon": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(-4), marginLeft: pxToRem(4) }
            : { marginLeft: pxToRem(-4), marginRight: pxToRem(4) })
        },
        "& $trailingIcon": {
          ...(direction === "rtl"
            ? { marginLeft: pxToRem(-4), marginRight: pxToRem(8) }
            : { marginRight: pxToRem(-4), marginLeft: pxToRem(8) })
        }
      },
      small: {
        minWidth: pxToRem(32),
        height: pxToRem(24),
        padding: `0 ${pxToRem(12)}`,
        "&$iconButton": {
          height: pxToRem(24),
          width: pxToRem(24),
          "& > $icon": asIconWrapper(16),
          "& > $spinner": { width: pxToRem(16), height: pxToRem(16) }
        },
        "& $label": { fontSize: pxToRem(12), lineHeight: 1.6666666667 },
        "& $icon": asIconWrapper(14),
        "& $spinner": { width: pxToRem(14), height: pxToRem(14) },
        "& $leadingIcon": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(-4), marginLeft: pxToRem(4) }
            : { marginLeft: pxToRem(-4), marginRight: pxToRem(4) })
        },
        "& $trailingIcon": {
          ...(direction === "rtl"
            ? { marginLeft: pxToRem(-4), marginRight: pxToRem(8) }
            : { marginRight: pxToRem(-4), marginLeft: pxToRem(8) })
        }
      },
      /* if (variant="filled") */
      filled: {
        "&$disabled, &[disabled]": {
          "& $label": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 }, true)
              : colors.createWhiteColor({ alpha: 0.24 }, true)
          },
          "& $icon": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 }, true)
              : colors.createWhiteColor({ alpha: 0.24 }, true)
          },
          boxShadow: "none !important",
          transform: "none !important",
          pointerEvents: "none",
          "&:hover": {
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": { backgroundColor: colors.transparent }
          }
        }
      },
      /* if (variant="filled", color="default") */
      filledDefault: {
        backgroundColor: filledDefault.background.main,
        "& $label": { color: filledDefault.text },
        "& $icon": { color: filledDefault.text },
        "&:not($disabled):hover": {
          backgroundColor: filledDefault.background.hover
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": { backgroundColor: colors.transparent }
        },
        "&:not($disabled):active": {
          backgroundColor: filledDefault.background.active
        },
        "&$raised": {
          boxShadow: `0 8px 12px -6px ${colors.createBlackColor({
            alpha: 0.16
          })}, 0 12px 16px 0 ${colors.createBlackColor({
            alpha: 0.12
          })}, 0 1px 32px 0 ${colors.createBlackColor({
            alpha: 0.08
          })}`,
          "&:hover": {
            boxShadow: `0 2px 6px -1px ${colors.createBlackColor({
              alpha: 0.24
            })}, 0 4px 10px 0 ${colors.createBlackColor({
              alpha: 0.12
            })}, 0 0 12px 0 ${colors.createBlackColor({
              alpha: 0.08
            })}`,
            transform: "translateY(2px)"
          }
        },
        "&$disabled": {
          "& $label": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 }, true)
              : colors.createWhiteColor({ alpha: 0.32 }, true)
          },
          "& $icon": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 }, true)
              : colors.createWhiteColor({ alpha: 0.32 }, true)
          },
          backgroundColor: filledDefault.background.disabled
        }
      },
      /* if (variant="filled", color="primary") */
      filledPrimary: {
        backgroundColor: filledPrimary.background.main,
        "& $label": { color: filledPrimary.text },
        "& $icon": { color: filledPrimary.text },
        "&:not($disabled):hover": {
          backgroundColor: filledPrimary.background.hover
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:not($disabled):active": {
          backgroundColor: filledPrimary.background.active
        },
        "&$raised": {
          "&$large": {
            boxShadow: `0 14px 20px -12px ${colors.createPrimaryColor({
              alpha: 0.32
            })}, 0 16px 24px 2px ${colors.createPrimaryColor({
              alpha: 0.14
            })}, 0 12px 30px -8px ${colors.createPrimaryColor({
              alpha: 0.12
            })}`,
            "&:hover": {
              boxShadow: `0 0 6px -2px ${colors.createPrimaryColor({
                alpha: 0.56
              })}, 0 4px 16px 0 ${colors.createPrimaryColor({
                alpha: 0.14
              })}, 0 2px 10px 0 ${colors.createPrimaryColor({
                alpha: 0.12
              })}`,
              transform: "translateY(2px)"
            }
          },
          "&$medium": {
            boxShadow: `0 8px 9px -4px ${colors.createPrimaryColor({
              alpha: 0.24
            })}, 0 14px 16px 2px ${colors.createPrimaryColor({
              alpha: 0.14
            })}, 0 5px 20px 4px ${colors.createPrimaryColor({ alpha: 0.12 })}`,
            "&:hover": {
              boxShadow: `0 0 4px -2px ${colors.createPrimaryColor({
                alpha: 0.56
              })}, 0 4px 8px 0 ${colors.createPrimaryColor({
                alpha: 0.14
              })}, 0 0 8px 2px ${colors.createPrimaryColor({
                alpha: 0.12
              })}`,
              transform: "translateY(2px)"
            }
          },
          "&$small": {
            boxShadow: `0 8px 9px -4px ${colors.createPrimaryColor({
              alpha: 0.24
            })}, 0 14px 16px 2px ${colors.createPrimaryColor({
              alpha: 0.14
            })}, 0 5px 20px 4px ${colors.createPrimaryColor({ alpha: 0.12 })}`,
            "&:hover": {
              boxShadow: `0 0 4px -2px ${colors.createPrimaryColor({
                alpha: 0.56
              })}, 0 4px 8px 0 ${colors.createPrimaryColor({
                alpha: 0.14
              })}, 0 0 8px 2px ${colors.createPrimaryColor({
                alpha: 0.12
              })}`,
              transform: "translateY(2px)"
            }
          }
        },
        "&$disabled": {
          backgroundColor: filledPrimary.background.disabled
        }
      },
      /* if (variant="filled", color="secondary") */
      filledSecondary: {
        backgroundColor: filledSecondary.background.main,
        "& $label": { color: filledSecondary.text },
        "& $icon": { color: filledSecondary.text },
        "&:not($disabled):hover": {
          backgroundColor: filledSecondary.background.hover
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:not($disabled):active": {
          backgroundColor: filledSecondary.background.active
        },
        "&$raised": {
          "&$large": {
            boxShadow: `0 14px 20px -12px ${colors.createSecondaryColor({
              alpha: 0.32
            })}, 0 16px 24px 2px ${colors.createSecondaryColor({
              alpha: 0.14
            })}, 0 12px 30px -8px ${colors.createSecondaryColor({
              alpha: 0.12
            })}`,
            "&:hover": {
              boxShadow: `0 0 6px -2px ${colors.createSecondaryColor({
                alpha: 0.56
              })}, 0 4px 16px 0 ${colors.createSecondaryColor({
                alpha: 0.14
              })}, 0 2px 10px 0 ${colors.createSecondaryColor({
                alpha: 0.12
              })}`,
              transform: "translateY(2px)"
            }
          },
          "&$medium": {
            boxShadow: `0 8px 9px -4px ${colors.createSecondaryColor({
              alpha: 0.24
            })}, 0 14px 16px 2px ${colors.createSecondaryColor({
              alpha: 0.14
            })}, 0 5px 20px 4px ${colors.createSecondaryColor({
              alpha: 0.12
            })}`,
            "&:hover": {
              boxShadow: `0 0 4px -2px ${colors.createSecondaryColor({
                alpha: 0.56
              })}, 0 4px 8px 0 ${colors.createSecondaryColor({
                alpha: 0.14
              })}, 0 0 8px 2px ${colors.createSecondaryColor({
                alpha: 0.12
              })}`,
              transform: "translateY(2px)"
            }
          },
          "&$small": {
            boxShadow: `0 8px 9px -4px ${colors.createSecondaryColor({
              alpha: 0.24
            })}, 0 14px 16px 2px ${colors.createSecondaryColor({
              alpha: 0.14
            })}, 0 5px 20px 4px ${colors.createSecondaryColor({
              alpha: 0.12
            })}`,
            "&:hover": {
              boxShadow: `0 0 4px -2px ${colors.createSecondaryColor({
                alpha: 0.56
              })}, 0 4px 8px 0 ${colors.createSecondaryColor({
                alpha: 0.14
              })}, 0 0 8px 2px ${colors.createSecondaryColor({
                alpha: 0.12
              })}`,
              transform: "translateY(2px)"
            }
          }
        },
        "&$disabled": {
          backgroundColor: filledSecondary.background.disabled
        }
      },
      /* if (variant="outlined") */
      outlined: {
        backgroundColor: colors.transparent,
        "&$disabled, &[disabled]": {
          backgroundColor: colors.transparent,
          pointerEvents: "none"
        }
      },
      /* if (variant="outlined", color="default") */
      outlinedDefault: {
        borderColor: outlinedDefault.border.main,
        "& $label": { color: outlinedDefault.text.main },
        "& $icon": { color: outlinedDefault.text.main },
        "&:not($disabled):hover": {
          "& $label": { color: outlinedDefault.text.hover },
          "& $icon": { color: outlinedDefault.text.hover },
          borderColor: outlinedDefault.border.hover,
          backgroundColor: outlinedDefault.background.hover
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:not($disabled):active": {
          "& $label": { color: outlinedDefault.text.active },
          "& $icon": { color: outlinedDefault.text.active },
          borderColor: outlinedDefault.border.active,
          backgroundColor: outlinedDefault.background.active
        },
        "&$disabled, &[disabled]": {
          borderColor: outlinedDefault.border.disabled,
          "& $label": { color: outlinedDefault.text.disabled },
          "& $icon": { color: outlinedDefault.text.disabled }
        }
      },
      /* if (variant="outlined", color="primary") */
      outlinedPrimary: {
        borderColor: outlinedPrimary.border.main,
        "& $label": { color: outlinedPrimary.text.main },
        "& $icon": { color: outlinedPrimary.text.main },
        "&:not($disabled):hover": {
          "& $label": { color: outlinedPrimary.text.hover },
          "& $icon": { color: outlinedPrimary.text.hover },
          borderColor: outlinedPrimary.border.hover,
          backgroundColor: outlinedPrimary.background.hover
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:not($disabled):active": {
          "& $label": { color: outlinedPrimary.text.active },
          "& $icon": { color: outlinedPrimary.text.active },
          borderColor: outlinedPrimary.border.active,
          backgroundColor: outlinedPrimary.background.active
        },
        "&$disabled, &[disabled]": {
          "& $label": { color: outlinedPrimary.text.disabled },
          "& $icon": { color: outlinedPrimary.text.disabled },
          borderColor: outlinedPrimary.border.disabled
        }
      },
      /* if (variant="outlined", color="secondary") */
      outlinedSecondary: {
        borderColor: outlinedSecondary.border.main,
        "& $label": { color: outlinedSecondary.text.main },
        "& $icon": { color: outlinedSecondary.text.main },
        "&:not($disabled):hover": {
          "& $label": { color: outlinedSecondary.text.hover },
          "& $icon": { color: outlinedSecondary.text.hover },
          borderColor: outlinedSecondary.border.hover,
          backgroundColor: outlinedSecondary.background.hover
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&:not($disabled):active": {
          "& $label": { color: outlinedSecondary.text.active },
          "& $icon": { color: outlinedSecondary.text.active },
          borderColor: outlinedSecondary.border.active,
          backgroundColor: outlinedSecondary.background.active
        },
        "&$disabled, &[disabled]": {
          "& $label": { color: outlinedSecondary.text.disabled },
          "& $icon": { color: outlinedSecondary.text.disabled },
          borderColor: outlinedSecondary.border.disabled
        }
      },
      /* if (variant="inlined") */
      inlined: {
        backgroundColor: colors.transparent,
        "&$disabled, &[disabled]": {
          backgroundColor: colors.transparent,
          pointerEvents: "none"
        }
      },
      /* if (variant="inlined", color="default") */
      inlinedDefault: {
        "& $label": { color: inlinedDefault.text.main },
        "& $icon": { color: inlinedDefault.text.main },
        "&:not($disabled):hover": {
          backgroundColor: inlinedDefault.background.hover,
          "& $label": { color: inlinedDefault.text.hover },
          "& $icon": { color: inlinedDefault.text.hover }
        },
        "&:not($disabled):active": {
          backgroundColor: inlinedDefault.background.active
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&$disabled, &[disabled]": {
          "& $label": { color: inlinedDefault.text.disabled },
          "& $icon": { color: inlinedDefault.text.disabled }
        }
      },
      /* if (variant="inlined", color="primary") */
      inlinedPrimary: {
        "& $label": { color: inlinedPrimary.text.main },
        "& $icon": { color: inlinedPrimary.text.main },
        "&:not($disabled):hover": {
          backgroundColor: inlinedPrimary.background.hover,
          "& $label": { color: inlinedPrimary.text.hover },
          "& $icon": { color: inlinedPrimary.text.hover }
        },
        "&:not($disabled):active": {
          backgroundColor: inlinedPrimary.background.active,
          "& $label": { color: inlinedPrimary.text.active },
          "& $icon": { color: inlinedPrimary.text.active }
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&$disabled, &[disabled]": {
          "& $label": { color: inlinedPrimary.text.disabled },
          "& $icon": { color: inlinedPrimary.text.disabled }
        }
      },
      /* if (variant="inlined", color="secondary") */
      inlinedSecondary: {
        "& $label": { color: inlinedSecondary.text.main },
        "& $icon": { color: inlinedSecondary.text.main },
        "&:not($disabled):hover": {
          backgroundColor: inlinedSecondary.background.hover,
          "& $label": { color: inlinedSecondary.text.hover },
          "& $icon": { color: inlinedSecondary.text.hover }
        },
        "&:not($disabled):active": {
          backgroundColor: inlinedSecondary.background.active,
          "& $label": { color: inlinedSecondary.text.active },
          "& $icon": { color: inlinedSecondary.text.active }
        },
        "&:hover": {
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
        },
        "&$disabled, &[disabled]": {
          "& $label": { color: inlinedSecondary.text.disabled },
          "& $icon": { color: inlinedSecondary.text.disabled }
        }
      },
      iconButton: {
        padding: "0",
        minWidth: "auto",
        borderRadius: "50%",
        "& > $icon": { margin: "0 !important" }
      },
      spinner: {
        position: "absolute",
        flexShrink: 0,
        "& ~ *": {
          visibility: "hidden",
          opacity: "0"
        }
      },
      icon: {
        ...hacks.backfaceVisibilityFix,
        flexShrink: 0,
        transition: "color 360ms ease"
      },
      raised: {},
      disabled: {},
      loading: {},
      iconed: {},
      leadingIcon: {},
      trailingIcon: {},
      focusVisible: {
        outline: `2px solid ${darkMode ? blue[500] : blue[600]}`,
        outlineOffset: 1
      }
    };
  },
  { name: "SonnatButton" }
);

export default useStyles;
