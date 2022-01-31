import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      colors: { background },
      spacings: { spaces }
    } = theme;

    return {
      root: { padding: spaces[7].rem },
      withOverflow: {
        overflowX: "hidden",
        overflowY: "scroll",
        backgroundColor: !darkMode ? "inherit" : background.dark.accents[2]
      }
    };
  },
  { name: "SonnatDialogBody" }
);

export default useStyles;
