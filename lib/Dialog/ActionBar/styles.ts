import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      spacings: { spaces }
    } = theme;

    return {
      root: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: spaces[7].rem,
        "& > * + *": {
          ...{
            ltr: { marginLeft: spaces[3].rem },
            rtl: { marginRight: spaces[3].rem }
          }[direction]
        }
      },
      withOverflow: {
        padding: [[spaces[5].rem, spaces[7].rem]],
        boxShadow: "0 -1px 2px 0 rgba(0, 0, 0, 0.12)"
      }
    };
  },
  { name: "SonnatActionBar" }
);

export default useStyles;
