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
        alignItems: "center",
        padding: spaces[3].rem,
        "& > * + *": {
          ...{
            ltr: { marginLeft: spaces[3].rem },
            rtl: { marginRight: spaces[3].rem }
          }[direction]
        }
      }
    };
  },
  { name: "SonnatCardActionBar" }
);

export default useStyles;
