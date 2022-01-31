import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      colors: { text },
      spacings: { spaces },
      typography: { pxToRem, variants }
    } = theme;

    return {
      root: {},
      title: {
        ...variants.bodySmall,
        color: !darkMode ? text.dark.primary : text.light.primary,
        paddingRight: spaces[7].rem,
        paddingLeft: spaces[7].rem,
        height: pxToRem(40),
        flexGrow: "1",
        display: "flex",
        alignItems: "center"
      },
      dense: {
        "& $title": {
          height: pxToRem(32),
          fontSize: variants.caption.fontSize,
          lineHeight: variants.caption.lineHeight
        }
      },
      hide: { display: "none" }
    };
  },
  { name: "SonnatMenuItemGroup" }
);

export default useStyles;
