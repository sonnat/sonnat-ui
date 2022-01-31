import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      spacings: { spaces },
      colors: { text, ...colors },
      mixins: { disableUserSelect },
      typography: { pxToRem, variants }
    } = theme;

    return {
      root: {
        ...variants.bodySmall,
        ...disableUserSelect(),
        color: !darkMode ? text.dark.secondary : text.light.secondary,
        width: "100%",
        flexShrink: "0",
        paddingRight: spaces[7].rem,
        paddingLeft: spaces[7].rem,
        display: "flex",
        alignItems: "center",
        minHeight: pxToRem(40),
        cursor: "pointer",
        overflow: "hidden",
        outline: "none",
        transition: "color 240ms ease, background-color 240ms ease",
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 }, true, darkMode)
            : colors.createWhiteColor({ alpha: 0.04 }, true, darkMode)
        },
        "&:active": {
          color: !darkMode ? colors.primary.origin : colors.primary.light,
          outline: "none"
        }
      },
      focused: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 }, true, darkMode)
          : colors.createWhiteColor({ alpha: 0.04 }, true, darkMode)
      },
      disabled: {
        pointerEvents: "none",
        color: !darkMode ? text.dark.disabled : text.light.disabled
      },
      hide: { display: "none" },
      dense: {
        fontSize: variants.caption.fontSize,
        lineHeight: variants.caption.lineHeight,
        minHeight: pxToRem(32)
      }
    };
  },
  { name: "SonnatMenuItem" }
);

export default useStyles;
