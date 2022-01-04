import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      spacings: { spaces },
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "flex",
        flexWrap: "wrap",
        marginRight: pxToRem(-spaces[3].px),
        marginLeft: pxToRem(-spaces[3].px)
      }
    };
  },
  { name: "SonnatRow" }
);

export default useStyles;
