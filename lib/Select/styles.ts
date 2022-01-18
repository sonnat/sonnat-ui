import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      spacings: { spaces },
      mixins: { asIconWrapper },
      typography: { variants, fontFamily }
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
        ...variants.body,
        color: colors.text.primary,
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
        marginTop: spaces[1].rem,
        padding: [[0, spaces[3].rem]]
      },
      helperContent: {
        display: "flex",
        margin: 0,
        flex: [[1, 0]]
      },
      helperText: {
        ...variants.caption,
        color: colors.text.secondary
      },
      helperIcon: {
        ...asIconWrapper(16),
        marginTop: spaces[0].rem,
        color: colors.text.secondary,
        ...(direction === "rtl"
          ? { marginLeft: spaces[1].rem }
          : { marginRight: spaces[1].rem })
      },
      placeholder: {
        ...variants.body,
        color: colors.text.hint,
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
          ? { marginLeft: spaces[1].rem }
          : { marginRight: spaces[1].rem }),
        marginBottom: spaces[0].rem,
        marginTop: spaces[0].rem
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
      open: { "& $caretIcon": { transform: "rotate(180deg)" } },
      small: {
        "& $helperText": {
          fontSize: variants.captionSmall.fontSize,
          lineHeight: variants.captionSmall.lineHeight
        },
        "& $helperIcon": asIconWrapper(14),
        "& $optionIcon": asIconWrapper(14),
        "& $placeholder, & $displaySingle": {
          fontSize: variants.caption.fontSize,
          lineHeight: variants.caption.lineHeight
        }
      },
      medium: {
        "& $optionIcon": asIconWrapper(14),
        "& $placeholder, & $displaySingle": {
          fontSize: variants.caption.fontSize,
          lineHeight: variants.caption.lineHeight
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
