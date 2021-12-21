import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { asIconWrapper },
      typography: { pxToRem, setText, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "inline-flex",
        position: "relative",
        flexDirection: "column",
        outline: "none"
      },
      base: { cursor: "pointer" },
      input: {
        ...setText({ color: colors.text.primary }),
        border: "none",
        outline: "none",
        padding: 0,
        margin: 0,
        flex: [[1, 1]],
        minWidth: 0,
        height: "100%",
        appearance: "none !important",
        backgroundColor: colors.transparent
      },
      helperRow: {
        display: "flex",
        marginTop: pxToRem(4),
        padding: [[0, pxToRem(8)]]
      },
      helperContent: {
        display: "flex",
        margin: 0,
        flex: [[1, 0]]
      },
      helperText: {
        ...setText({
          fontSize: pxToRem(12),
          lineHeight: 1.6666666667,
          color: colors.text.secondary
        })
      },
      helperIcon: {
        ...asIconWrapper(16),
        marginTop: pxToRem(2),
        color: colors.text.secondary,
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) })
      },
      placeholder: {
        ...setText({ color: colors.text.hint }),
        flexGrow: "1",
        overflow: "hidden",
        alignSelf: "center",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      display: { display: "flex", height: "100%" },
      displaySingle: {
        extend: "placeholder",
        color: colors.text.primary
      },
      displayMultiple: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap"
      },
      chip: {
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) }),
        marginBottom: pxToRem(2),
        marginTop: pxToRem(2)
      },
      menu: {},
      option: {},
      optionGroup: {},
      optionIcon: asIconWrapper(16),
      caretIcon: {},
      selected: {
        color: !darkMode ? colors.primary.origin : colors.primary.light
      },
      disabled: {
        pointerEvents: "none",
        "& $placeholder, & $displaySingle": { color: colors.text.disabled }
      },
      open: {
        "& $caretIcon": { transform: "rotate(180deg)" }
      },
      small: {
        "& $helperText": {
          fontSize: pxToRem(10),
          lineHeight: 1.8
        },
        "& $helperIcon": {
          ...asIconWrapper(14)
        },
        "& $optionIcon": asIconWrapper(14),
        "& $placeholder, & $displaySingle": {
          fontSize: pxToRem(12),
          lineHeight: 1.6666666667
        }
      },
      medium: {
        "& $optionIcon": asIconWrapper(14),
        "& $placeholder, & $displaySingle": {
          fontSize: pxToRem(12),
          lineHeight: 1.6666666667
        }
      },
      large: {},
      fluid: { width: "100%" },
      errored: {
        "&:not($disabled)": {
          "& $helperText": {
            color: !darkMode ? colors.error.origin : colors.error.light
          },
          "& $helperIcon": {
            color: !darkMode ? colors.error.origin : colors.error.light
          }
        }
      },
      native: {},
      focusVisible: {}
    };
  },
  { name: "SonnatSelect" }
);

export default useStyles;
