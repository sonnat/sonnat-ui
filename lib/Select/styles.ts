import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      direction,
      spacings: { spaces },
      mixins: { asIconWrapper },
      typography: { variants, fontFamily },
      colors: { text, transparent, primary, error }
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
        color: !darkMode ? text.dark.primary : text.light.primary,
        border: "none",
        outline: "none",
        padding: 0,
        margin: 0,
        flex: [[1, 1]],
        minWidth: 0,
        height: "100%",
        appearance: "none !important",
        backgroundColor: transparent
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
        color: !darkMode ? text.dark.secondary : text.light.secondary
      },
      helperIcon: {
        ...asIconWrapper(16),
        marginTop: spaces[0].rem,
        color: !darkMode ? text.dark.secondary : text.light.secondary,
        ...(direction === "rtl"
          ? { marginLeft: spaces[1].rem }
          : { marginRight: spaces[1].rem })
      },
      placeholder: {
        ...variants.body,
        color: !darkMode ? text.dark.hint : text.light.hint,
        flexGrow: "1",
        overflow: "hidden",
        alignSelf: "center",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      display: { display: "flex", height: "100%" },
      displaySingle: {
        extend: "placeholder",
        color: !darkMode ? text.dark.primary : text.light.primary
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
      selected: { color: !darkMode ? primary.origin : primary.light },
      disabled: {
        pointerEvents: "none",
        "& $placeholder, & $displaySingle": {
          color: !darkMode ? text.dark.disabled : text.light.disabled
        }
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
          "& $helperText": { color: !darkMode ? error.origin : error.light },
          "& $helperIcon": { color: !darkMode ? error.origin : error.light }
        }
      },
      native: {},
      focusVisible: {}
    };
  },
  { name: "SonnatSelect" }
);

export default useStyles;
