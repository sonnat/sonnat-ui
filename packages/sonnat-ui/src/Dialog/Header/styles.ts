import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        position: "relative",
        flex: [[1, 1, "auto"]],
        display: "flex",
        padding: pxToRem(16),
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
