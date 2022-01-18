import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      spacings: { spaces }
    } = theme;

    return {
      root: {
        position: "relative",
        flex: [[1, 1, "auto"]],
        display: "flex",
        padding: spaces[7].rem,
        alignItems: "center"
      },
      withOverflow: {
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.12)"
      }
    };
  },
  { name: "SonnatHeader" }
);

export default useStyles;
