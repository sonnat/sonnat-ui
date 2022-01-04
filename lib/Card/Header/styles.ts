import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      spacings: { spaces }
    } = theme;

    return {
      root: {
        display: "flex",
        padding: spaces[7].rem,
        alignItems: "center"
      },
      body: { flex: [[1, 1, "auto"]] },
      action: {
        flex: [[0, 0, "auto"]],
        alignSelf: "flex-start",
        ...{
          ltr: { marginLeft: spaces[3].rem },
          rtl: { marginRight: spaces[3].rem }
        }[direction]
      }
    };
  },
  { name: "SonnatCardHeader" }
);

export default useStyles;
