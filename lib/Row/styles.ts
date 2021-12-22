import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      spacings: { gutter },
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "flex",
        flexWrap: "wrap",
        marginRight: pxToRem(-gutter / 2),
        marginLeft: pxToRem(-gutter / 2)
      }
    };
  },
  { name: "SonnatRow" }
);

export default useStyles;
