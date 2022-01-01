import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction]
      },
      svg: {
        width: "100%",
        height: "100%",
        animationName: "$rotateAnimation",
        animationDuration: "0.8s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite"
      },
      base: {
        transition: "fill 360ms ease"
      },
      movingParticle: {
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: pxToRem(2),
        animationName: "$clipAnimation",
        animationDuration: "1.6s",
        animationTimingFunction: "ease-in",
        animationIterationCount: "infinite",
        transformOrigin: "center"
      },
      "@keyframes clipAnimation": {
        "0%": { strokeDasharray: "1, 100", strokeDashoffset: "0" },
        "50%": { strokeDasharray: "80, 100", strokeDashoffset: "46" },
        "100%": { strokeDasharray: "1, 100", strokeDashoffset: "0" }
      },
      "@keyframes rotateAnimation": {
        "100%": { transform: "rotate(360deg)" }
      }
    };
  },
  { name: "SonnatClipSpinner" }
);

export default useStyles;
