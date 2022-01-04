import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      radius,
      spacings: { spaces },
      swatches: { blue },
      mixins: { asIconWrapper },
      typography: { pxToRem, setText, fontFamily }
    } = theme;

    return {
      root: {
        direction: "ltr",
        fontFamily: fontFamily[direction],
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        borderRadius: radius.small,
        border: `1px solid ${
          !darkMode
            ? colors.createBlackColor({ alpha: 0.24 }, true)
            : colors.createWhiteColor({ alpha: 0.24 }, true)
        }`,
        transition: "border-color 360ms ease",
        "&:not($disabled):hover": {
          borderColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.48 }, true)
            : colors.createWhiteColor({ alpha: 0.48 }, true),
          "& $input": { color: colors.text.primary }
        }
      },
      action: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        justifyItems: "center",
        flexShrink: "0",
        outline: "none",
        border: "none",
        cursor: "pointer",
        padding: "0",
        margin: "0",
        backgroundColor: colors.transparent,
        transition: "background-color 360ms ease",
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 }),
          "&:after, &:before": { opacity: 0 }
        },
        "&:active": {
          backgroundColor: colors.divider,
          "&:after, &:before": { opacity: 0 }
        },
        "&:after, &:before": {
          width: 1,
          backgroundColor: colors.divider,
          opacity: "1",
          transition: "opacity 360ms ease"
        },
        "&:after": { marginLeft: "auto" },
        "&:before": { marginRight: "auto" }
      },
      addAction: {
        borderRadius: `0 ${radius.small} ${radius.small} 0`,
        "&:before": { content: '""' },
        "& $actionIcon": { marginRight: "auto" }
      },
      subtractAction: {
        borderRadius: `${radius.small} 0 0 ${radius.small}`,
        "&:after": { content: '""' },
        "& $actionIcon": { marginLeft: "auto" }
      },
      actionIcon: {
        color: colors.text.secondary,
        transition: "color 360ms ease"
      },
      disabledAction: {
        pointerEvents: "none",
        "& $actionIcon": { color: colors.text.disabled }
      },
      input: {
        ...setText({ color: colors.text.hint }),
        textAlign: "center",
        width: "100%",
        height: "100%",
        margin: "0",
        padding: "0",
        outline: "none",
        border: "none",
        backgroundColor: colors.transparent,
        transition: "color 360ms ease",
        "&[readonly]": { pointerEvents: "none" }
      },
      inputContainer: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "1 0",
        height: "100%",
        padding: `0 ${spaces[3].rem}`
      },
      fluid: {
        display: "flex",
        width: "100%"
      },
      disabled: {
        pointerEvents: "none",
        borderColor: colors.divider,
        "& $actionIcon": { color: colors.text.disabled }
      },
      small: {
        height: pxToRem(24),
        "& $action": {
          width: pxToRem(24),
          height: pxToRem(22),
          "&:after,&:before": { height: pxToRem(16) }
        },
        "& $actionIcon": asIconWrapper(14),
        "& $input": { fontSize: pxToRem(12), lineHeight: 1.6666666667 }
      },
      medium: {
        height: pxToRem(32),
        "& $action": {
          width: pxToRem(32),
          height: pxToRem(30),
          "&:after,&:before": { height: pxToRem(16) }
        },
        "& $actionIcon": asIconWrapper(16),
        "& $input": { fontSize: pxToRem(14), lineHeight: 1.5714285714 }
      },
      large: {
        height: pxToRem(40),
        "& $action": {
          width: pxToRem(40),
          height: pxToRem(38),
          "&:after,&:before": { height: pxToRem(24) }
        },
        "& $actionIcon": asIconWrapper(20)
      },
      focusVisible: {
        outline: `2px solid ${darkMode ? blue[500] : blue[600]}`,
        outlineOffset: 1
      }
    };
  },
  { name: "SonnatInputStepper" }
);

export default useStyles;
