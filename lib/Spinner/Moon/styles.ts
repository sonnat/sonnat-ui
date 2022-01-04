import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      radius,
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      },
      base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: radius.rounded,
        animationName: "$rotateAnimation",
        animationDuration: "600ms",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite"
      },
      movingParticle: {
        position: "absolute",
        top: "0",
        width: pxToRem(4),
        height: pxToRem(4),
        transform: "translateY(-100%)",
        borderRadius: radius.rounded
      },
      "@keyframes rotateAnimation": {
        "0%": { transform: "rotate(0)" },
        "100%": { transform: "rotate(360deg)" }
      }
    };
  },
  { name: "SonnatMoonSpinner" }
);

export default useStyles;
