import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        display: "flex",
        alignItems: "center",
        padding: pxToRem(8),
        "& > * + *": {
          ...{
            ltr: { marginLeft: pxToRem(8) },
            rtl: { marginRight: pxToRem(8) }
          }[direction]
        }
      }
    };
  },
  { name: "SonnatCardActionBar" }
);

export default useStyles;
