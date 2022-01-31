import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      darkMode,
      colors: { text, divider },
      spacings: { spaces },
      typography: { pxToRem, fontWeight, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        position: "relative",
        margin: "0",
        border: "none",
        flexShrink: "0",
        "&:not($vertical):not($dotted)": {
          width: "100%",
          height: 1,
          backgroundColor: !darkMode ? divider.dark : divider.light
        }
      },
      spaced: {
        "&:not($vertical)": {
          marginTop: spaces[7].rem,
          marginBottom: spaces[7].rem
        },
        "&$vertical": {
          marginLeft: spaces[7].rem,
          marginRight: spaces[7].rem
        }
      },
      dotted: {
        boxSizing: "content-box",
        height: "0",
        textAlign: "center",
        fontSize: pxToRem(28),
        lineHeight: "1.14285714",
        fontWeight: fontWeight.regular,
        marginTop: spaces[10].rem,
        marginBottom: spaces[3].rem,
        border: "none",
        "&:after": {
          content: '"..."',
          display: "inline-block",
          marginLeft: "0.6em",
          position: "relative",
          color: !darkMode ? text.dark.primary : text.light.primary,
          top: pxToRem(-spaces[10].px),
          letterSpacing: "0.6em"
        }
      },
      vertical: {
        height: "auto",
        width: 1,
        backgroundColor: !darkMode ? divider.dark : divider.light,
        alignSelf: "stretch"
      }
    };
  },
  { name: "SonnatDivider" }
);

export default useStyles;
