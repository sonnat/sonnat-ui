import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      spacings: { spaces }
    } = theme;

    return {
      root: { padding: spaces[7].rem },
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
