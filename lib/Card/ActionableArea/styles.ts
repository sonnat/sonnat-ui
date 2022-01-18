import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => ({
    root: {
      position: "relative",
      width: "100%",
      cursor: "pointer",
      "&:after": {
        content: '""',
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0,
        backgroundColor: "currentcolor",
        transition: "opacity 180ms ease"
      },
      "&:hover:after": {
        opacity: 0.04,
        "@media (hover: none)": { opacity: 0 }
      },
      "&:active:after": {
        opacity: 0.08
      }
    },
    focusVisible: {
      outline: `2px solid ${
        theme.darkMode ? theme.swatches.blue[500] : theme.swatches.blue[600]
      }`,
      outlineOffset: 1
    }
  }),
  { name: "SonnatCardActionableArea" }
);

export default useStyles;
