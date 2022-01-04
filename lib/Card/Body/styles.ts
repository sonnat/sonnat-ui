import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      spacings: { spaces }
    } = theme;

    return { root: { padding: spaces[7].rem } };
  },
  { name: "SonnatCardBody" }
);

export default useStyles;
