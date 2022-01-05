import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      darkMode,
      zIndexes,
      radius,
      typography: { pxToRem, fontFamily }
    } = theme;

    const boxShadow = {
      darkMode: [
        "0 4px 4px -4px rgba(0, 0, 0, 0.12)",
        "0 8px 10px 1px rgba(0, 0, 0, 0.08)",
        "0 4px 8px 2px rgba(0, 0, 0, 0.04)",
        "0 0 0 1px rgba(0, 0, 0, 0.12)"
      ].join(", "),
      lightMode: [
        "0 1px 6px 0 rgba(0, 0, 0, 0.04)",
        "0 -8px 32px -4px rgba(0, 0, 0, 0.08)",
        "0 16px 24px -6px rgba(0, 0, 0, 0.04)"
      ].join(", ")
    };

    return {
      root: {
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: zIndexes.modal,
        direction,
        fontFamily: fontFamily[direction],
        outline: "none",
        visibility: "hidden",
        opacity: 0,
        transition: ["opacity 360ms ease", "visibility 360ms ease"].join(", ")
      },
      backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        outline: "none",
        backgroundColor: "rgba(0, 0, 0, 0.56)"
      },
      dialog: {
        width: "100%",
        maxWidth: pxToRem(560),
        maxHeight: "70vh",
        margin: pxToRem(32),
        position: "relative",
        borderRadius: radius.small,
        boxShadow: !darkMode ? boxShadow.lightMode : boxShadow.darkMode,
        backgroundColor: !darkMode
          ? colors.background.origin
          : colors.background.accents[1],
        outline: "none"
      },
      open: {
        visibility: "visible",
        opacity: 1
      },
      fullScreen: {
        "& $dialog": {
          margin: 0,
          width: "100%",
          maxWidth: "100%",
          height: "100%",
          maxHeight: "none",
          borderRadius: 0
        }
      }
    };
  },
  { name: "SonnatDialog" }
);

export default useStyles;
