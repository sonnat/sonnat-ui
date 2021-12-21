import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      mixins: { disableUserSelect },
      typography: { pxToRem, setText }
    } = theme;

    return {
      root: {
        ...setText({
          fontSize: pxToRem(14),
          lineHeight: 1.5714285714,
          color: colors.text.secondary
        }),
        ...disableUserSelect(),
        width: "100%",
        flexShrink: "0",
        paddingRight: pxToRem(16),
        paddingLeft: pxToRem(16),
        display: "flex",
        alignItems: "center",
        minHeight: pxToRem(40),
        cursor: "pointer",
        overflow: "hidden",
        outline: "none",
        transition: "color 240ms ease, background-color 240ms ease",
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 })
        },
        "&:active": {
          color: !darkMode ? colors.primary.origin : colors.primary.light,
          outline: "none"
        }
      },
      focused: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 })
          : colors.createWhiteColor({ alpha: 0.04 })
      },
      disabled: {
        pointerEvents: "none",
        color: colors.text.disabled
      },
      hide: { display: "none" },
      dense: { fontSize: pxToRem(12), minHeight: pxToRem(32) }
    };
  },
  { name: "SonnatMenuItem" }
);

export default useStyles;
