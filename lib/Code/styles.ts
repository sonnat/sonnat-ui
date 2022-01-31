import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      direction,
      radius,
      colors: { divider, text, transparent },
      spacings: { spaces },
      swatches: { grey },
      typography: { fontWeight, setText, fontFamily }
    } = theme;

    return {
      root: {
        ...setText({
          fontSize: "0.875em",
          fontWeight: fontWeight.regular,
          lineHeight: 1.5714285714,
          color: !darkMode ? text.dark.primary : text.light.primary
        }),
        direction,
        fontFamily: fontFamily.monospace,
        borderRadius: radius.xSmall,
        backgroundColor: !darkMode ? grey[50] : grey[900],
        display: "inline-block",
        padding: `0 ${spaces[1].rem}`
      },
      codeBlock: {
        overflow: "auto",
        display: "block",
        textAlign: "left",
        direction: "ltr",
        fontSize: "0.875em",
        padding: spaces[7].rem,
        backgroundColor: transparent,
        border: `1px solid ${!darkMode ? divider.dark : divider.light}`,
        borderRadius: radius.small
      }
    };
  },
  { name: "SonnatCode" }
);

export default useStyles;
