import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      zIndexes,
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: zIndexes.header,
        opacity: 0,
        visibility: "hidden",
        transition: "opacity 360ms ease, visibility 360ms ease"
      },
      progress: {
        position: "absolute",
        zIndex: 2,
        top: 0,
        left: 0,
        height: pxToRem(4),
        backgroundColor: !darkMode
          ? colors.primary.origin
          : colors.primary.light,
        transition: "width 360ms ease"
      },
      overlay: {
        position: "absolute",
        zIndex: 1,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: darkMode
          ? "rgba(0, 0, 0, 0.56)"
          : "rgba(255, 255, 255, 0.7)"
      },
      visible: { opacity: 1, visibility: "visible" }
    };
  },
  { name: "SonnatPageLoader" }
);

export default useStyles;
