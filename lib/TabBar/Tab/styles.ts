import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      spacings: { spaces },
      swatches: { blue },
      mixins: { asIconWrapper },
      typography: { pxToRem, variants, fontWeight }
    } = theme;

    return {
      root: {
        outline: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        appearance: "none !important",
        cursor: "pointer",
        transition: "250ms ease",
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 }, true)
            : colors.createWhiteColor({ alpha: 0.04 }, true)
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.08 }, true)
            : colors.createWhiteColor({ alpha: 0.08 }, true)
        },
        "&:after": {
          content: "''",
          position: "absolute",
          width: "100%",
          height: `calc(100% - ${pxToRem(8)})`,
          border: `2px solid ${darkMode ? blue[500] : blue[600]}`,
          opacity: 0,
          visibility: "hidden"
        }
      },
      content: {
        flex: [[1, 0]],
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        textAlign: "center",
        overflow: "hidden",
        display: "flex",
        alignItems: "center"
      },
      label: {
        ...variants.body,
        color: colors.text.secondary,
        transition: "color 360ms ease"
      },
      icon: {
        ...asIconWrapper(20),
        color: colors.text.secondary,
        transition: "color 360ms ease",
        "& + $label": {
          ...(direction === "rtl"
            ? { marginRight: spaces[1].rem }
            : { marginLeft: spaces[1].rem })
        }
      },
      fluid: {
        "& $content": { justifyContent: "center" }
      },
      stable: {
        minWidth: 0,
        opacity: "1",
        transition:
          "background-color 250ms ease, transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 0s",
        flex: [[1, 1, "auto"]]
      },
      small: {
        minHeight: pxToRem(32),
        padding: [[0, spaces[7].rem]],
        "& $label": {
          fontSize: variants.caption.fontSize,
          lineHeight: variants.caption.lineHeight,
          fontWeight: fontWeight.medium
        },
        "& $icon": asIconWrapper(14),
        "&$iconTab $icon": asIconWrapper(16),
        "&$leadingIconed": { padding: [[0, spaces[5].rem]] }
      },
      medium: {
        minHeight: pxToRem(40),
        padding: [[0, spaces[9].rem]],
        "& $label": {
          fontSize: variants.bodySmall.fontSize,
          lineHeight: variants.bodySmall.lineHeight,
          fontWeight: fontWeight.medium
        },
        "& $icon": asIconWrapper(16),
        "&$iconTab $icon": asIconWrapper(18),
        "&$leadingIconed": { padding: [[0, spaces[5].rem]] }
      },
      large: {
        minHeight: pxToRem(48),
        padding: [[0, spaces[10].rem]],
        "& $icon": {
          ...asIconWrapper(20),
          "& + $label": {
            ...(direction === "rtl"
              ? { marginRight: spaces[3].rem }
              : { marginLeft: spaces[3].rem })
          }
        },
        "&$iconTab $icon": asIconWrapper(24),
        "&$leadingIconed": { padding: [[0, spaces[7].rem]] }
      },
      active: {
        "& $label": {
          color: !darkMode ? colors.primary.origin : colors.primary.light
        },
        "& $icon": {
          color: !darkMode ? colors.primary.origin : colors.primary.light
        },
        "&:hover": {
          backgroundColor: colors.createPrimaryColor({ alpha: 0.04 }, true)
        },
        "&:active": {
          backgroundColor: colors.createPrimaryColor({ alpha: 0.08 }, true)
        }
      },
      leadingIconed: {},
      iconTab: { "& $content": { justifyContent: "center" } },
      focusVisible: { "&:after": { opacity: 1, visibility: "visible" } }
    };
  },
  { name: "SonnatTab" }
);

export default useStyles;
