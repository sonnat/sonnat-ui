import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ClipSpinner from "../Spinner/Clip";
import { makeStyles, useTheme } from "../styles";
import { blue } from "../styles/pallete";
import getVar from "../utils/getVar";
import useEventCallback from "../utils/useEventCallback";
import useForkRef from "../utils/useForkRef";
import useIsFocusVisible from "../utils/useIsFocusVisible";
import createColorVariants from "./createColorVariants";

const componentName = "Button";
const allowedVariants = ["filled", "inlined", "outlined"];
const allowedSizes = ["large", "medium", "small"];
const allowedColors = ["default", "primary", "secondary"];

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      darkMode,
      hacks,
      mixins: { useIconWrapper },
      typography: { pxToRem, useText, fontWeight, fontFamily }
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
        border: `${pxToRem(1)} solid ${colors.transparent}`,
        outline: "none",
        verticalAlign: "middle",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        transition: defaultTransitionList.join(",")
      },
      label: {
        ...useText({ fontWeight: fontWeight.medium }),
        ...hacks.backfaceVisibilityFix,
        flexShrink: 0,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        transition: "color 360ms ease"
      },
      rounded: {
        borderRadius: pxToRem(24)
      },
      large: {
        minWidth: pxToRem(96),
        height: pxToRem(40),
        padding: `0 ${pxToRem(16)}`,
        "&$iconButton": {
          height: pxToRem(40),
          width: pxToRem(40),
          "& > $icon": useIconWrapper(20),
          "& > $spinner": { width: pxToRem(20), height: pxToRem(20) }
        },
        "& $label": { fontSize: pxToRem(16), lineHeight: 1.625 },
        "& $icon": useIconWrapper(20),
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
          "& > $icon": useIconWrapper(16),
          "& > $spinner": { width: pxToRem(16), height: pxToRem(16) }
        },
        "& $label": { fontSize: pxToRem(14), lineHeight: 1.5714285714 },
        "& $icon": useIconWrapper(16),
        "& $spinner": { width: pxToRem(16), height: pxToRem(16) },
        "& $leadingIcon": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(-4), marginLeft: pxToRem(4) }
            : { marginLeft: pxToRem(-4), marginRight: pxToRem(4) })
        },
        "& $trailingIcon": {
          ...(direction === "rtl"
            ? { marginLeft: pxToRem(-4), marginRight: pxToRem(4) }
            : { marginRight: pxToRem(-4), marginLeft: pxToRem(4) })
        }
      },
      small: {
        minWidth: pxToRem(32),
        height: pxToRem(24),
        padding: `0 ${pxToRem(12)}`,
        "&$iconButton": {
          height: pxToRem(32),
          width: pxToRem(32),
          "& > $icon": useIconWrapper(16),
          "& > $spinner": { width: pxToRem(16), height: pxToRem(16) }
        },
        "& $label": { fontSize: pxToRem(12), lineHeight: 1.6666666667 },
        "& $icon": useIconWrapper(14),
        "& $spinner": { width: pxToRem(14), height: pxToRem(14) },
        "& $leadingIcon": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(-4), marginLeft: pxToRem(4) }
            : { marginLeft: pxToRem(-4), marginRight: pxToRem(4) })
        },
        "& $trailingIcon": {
          ...(direction === "rtl"
            ? { marginLeft: pxToRem(-4), marginRight: pxToRem(4) }
            : { marginRight: pxToRem(-4), marginLeft: pxToRem(4) })
        }
      },
      /* if (variant="filled") */
      filled: {
        "&$disabled, &[disabled]": {
          "& $label": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 })
              : colors.createWhiteColor({ alpha: 0.12 })
          },
          "& $icon": {
            color: !darkMode
              ? colors.createBlackColor({ alpha: 0.32 })
              : colors.createWhiteColor({ alpha: 0.12 })
          },
          boxShadow: "none !important",
          transform: "none !important",
          pointerEvents: "none",
          "&:hover": {
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": {
              backgroundColor: colors.transparent
            }
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
          "@media (hover: none)": {
            backgroundColor: colors.transparent
          }
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
        "& > $icon": {
          margin: "0 !important"
        }
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
        outline: `2px solid ${darkMode ? blue[300] : blue[500]}`,
        outlineOffset: 1
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Button = React.memo(
  React.forwardRef(function Button(props, ref) {
    const {
      label,
      className,
      leadingIcon,
      trailingIcon,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      onClick,
      rootNode: RootNode = "button",
      size: sizeProp = "medium",
      color: colorProp = "default",
      variant: variantProp = "filled",
      rounded = false,
      disabled = false,
      raised = false,
      loading = false,
      ...otherProps
    } = props;

    const {
      darkMode,
      colors: { createPrimaryColor, createSecondaryColor, createBlackColor }
    } = useTheme();

    const classes = useStyles();

    const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

    const color = getVar(
      colorProp,
      "default",
      !allowedColors.includes(colorProp)
    );

    const variant = getVar(
      variantProp,
      "filled",
      !allowedVariants.includes(variantProp)
    );

    let invalidUsageOfRaised = false;

    if (raised && variantProp !== "filled") {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(
          [
            `Sonnat: You can not use the \`raised={true}\` and \`variant="${variant}"\` properties ` +
              "at the same time on `Button` component.",
            `We will fallback to \`raised={false}\` and \`variant="${variant}"\`.`
          ].join("\n")
        );
      }

      invalidUsageOfRaised = true;
    }

    const isNative = RootNode === "button";
    const isLabeled = label != null;
    const isIconed = leadingIcon != null || trailingIcon != null;
    const isInvalid = !isLabeled && !isIconed;
    const isIconButton = !isInvalid && !isLabeled && isIconed;

    const {
      isFocusVisibleRef,
      onBlur: handleBlurVisible,
      onFocus: handleFocusVisible,
      ref: focusVisibleRef
    } = useIsFocusVisible();

    const buttonRef = React.useRef(null);

    const handleOwnRef = useForkRef(focusVisibleRef, buttonRef);
    const handleRef = useForkRef(ref, handleOwnRef);

    const [focusVisible, setFocusVisible] = React.useState(false);

    if (disabled && focusVisible) {
      setFocusVisible(false);
    }

    React.useEffect(() => {
      isFocusVisibleRef.current = focusVisible;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusVisible]);

    const handleFocus = useEventCallback(event => {
      // Fix for https://github.com/facebook/react/issues/7769
      if (!buttonRef.current) buttonRef.current = event.currentTarget;

      handleFocusVisible(event);

      if (isFocusVisibleRef.current === true) setFocusVisible(true);
      if (onFocus) onFocus(event);
    });

    const handleBlur = useEventCallback(event => {
      handleBlurVisible(event);

      if (isFocusVisibleRef.current === false) setFocusVisible(false);
      if (onBlur) onBlur(event);
    });

    const keyDownRef = React.useRef(false);

    const handleKeyDown = useEventCallback(event => {
      if (keyDownRef.current === false && focusVisible && event.key === " ") {
        keyDownRef.current = true;
      }

      if (
        event.target === event.currentTarget &&
        !isNative &&
        event.key === " "
      ) {
        event.preventDefault();
      }

      if (onKeyDown) onKeyDown(event);

      // Keyboard accessibility for non interactive elements
      if (
        event.target === event.currentTarget &&
        !isNative &&
        event.key.toLowerCase() === "enter" &&
        !disabled
      ) {
        event.preventDefault();
        if (onClick) onClick(event);
      }
    });

    const handleKeyUp = useEventCallback(event => {
      if (!event.defaultPrevented && focusVisible && event.key === " ") {
        keyDownRef.current = false;
      }

      if (onKeyUp) onKeyUp(event);

      // Keyboard accessibility for non interactive elements
      if (
        event.target === event.currentTarget &&
        !isNative &&
        event.key === " " &&
        !event.defaultPrevented
      ) {
        if (onClick) onClick(event);
      }
    });

    const conditionalProps = {};

    if (isNative) {
      conditionalProps.disabled = disabled;
    } else {
      conditionalProps["aria-disabled"] = disabled;
      conditionalProps.role = "button";
    }

    const iconComponents = { leading: null, trailing: null, single: null };

    if (isIconButton) {
      const icon = leadingIcon || trailingIcon;
      iconComponents.single = (
        <i className={clx(classes.leadingIcon, classes.icon)}>{icon}</i>
      );
    } else {
      if (leadingIcon != null) {
        iconComponents.leading = (
          <i className={clx(classes.leadingIcon, classes.icon)}>
            {leadingIcon}
          </i>
        );
      }

      if (trailingIcon != null) {
        iconComponents.trailing = (
          <i className={clx(classes.trailingIcon, classes.icon)}>
            {trailingIcon}
          </i>
        );
      }
    }

    const spinnerColor = {
      background:
        {
          outlined: {
            primary: createPrimaryColor({ alpha: 0.12 }),
            secondary: createSecondaryColor({ alpha: 0.12 })
          }[color]
        }[variant] || (darkMode ? null : createBlackColor({ alpha: 0.12 })),
      foreground:
        {
          outlined: {
            primary: createPrimaryColor({ alpha: 0.48 }),
            secondary: createSecondaryColor({ alpha: 0.48 })
          }[color]
        }[variant] || (darkMode ? null : createBlackColor({ alpha: 0.48 }))
    };

    return isInvalid ? null : (
      <RootNode
        type="button"
        tabIndex={disabled ? -1 : 0}
        ref={handleRef}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className={clx(
          className,
          classes.root,
          classes[variant],
          classes[size],
          classes[camelCase(`${variant}-${color}`)],
          {
            [classes.loading]: loading,
            [classes.iconed]: isIconed,
            [classes.rounded]: rounded,
            [classes.focusVisible]: focusVisible,
            [classes.raised]: invalidUsageOfRaised ? false : raised,
            [classes.disabled]: loading || (!loading && disabled),
            [classes.iconButton]: isIconButton
          }
        )}
        {...conditionalProps}
        {...otherProps}
      >
        {loading && (
          <ClipSpinner
            backgroundColor={spinnerColor.background}
            foregroundColor={spinnerColor.foreground}
            className={clx(classes.spinner)}
          />
        )}
        {iconComponents.leading}
        {!isIconButton ? (
          <span className={classes.label}>{label}</span>
        ) : (
          iconComponents.single
        )}
        {iconComponents.trailing}
      </RootNode>
    );
  })
);

Button.displayName = componentName;

Button.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  disabled: PropTypes.bool,
  raised: PropTypes.bool,
  loading: PropTypes.bool,
  color: PropTypes.oneOf(allowedColors),
  size: PropTypes.oneOf(allowedSizes),
  variant: PropTypes.oneOf(allowedVariants),
  rootNode: PropTypes.elementType,
  leadingIcon: PropTypes.node,
  trailingIcon: PropTypes.node,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onClick: PropTypes.func
};

export default Button;
