import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      typography: { pxToRem }
    } = theme;

    return {
      root: { padding: pxToRem(16) },
      withOverflow: {
        overflowX: "hidden",
        overflowY: "scroll",
        backgroundColor: !darkMode ? "inherit" : colors.background.level[2]
      }
    };
  },
  { name: "SonnatDialogBody" }
);

export default useStyles;
