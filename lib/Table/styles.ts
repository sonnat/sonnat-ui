import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      radius,
      darkMode,
      colors: { text, divider },
      spacings: { spaces },
      typography: { variants, fontFamily, fontWeight }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        width: "100%",
        overflowX: "auto",
        borderRadius: radius.small,
        border: `1px solid ${!darkMode ? divider.dark : divider.light}`
      },
      table: {
        display: "table",
        width: "100%",
        borderCollapse: "collapse",
        borderSpacing: 0,
        captionSide: "bottom"
      },
      caption: {
        ...variants.caption,
        fontWeight: fontWeight.medium,
        textAlign: "inherit",
        padding: spaces[7].rem,
        color: !darkMode ? text.dark.secondary : text.light.secondary
      },
      dense: { "& $caption": { padding: spaces[3].rem } },
      borderLess: { border: "none" }
    };
  },
  { name: "SonnatTable" }
);

export default useStyles;
