import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: pxToRem(16),
        "& > * + *": {
          ...{
            ltr: { marginLeft: pxToRem(8) },
            rtl: { marginRight: pxToRem(8) }
          }[direction]
        }
      },
      withOverflow: {
        padding: [[pxToRem(12), pxToRem(16)]],
        boxShadow: "0 -1px 2px 0 rgba(0, 0, 0, 0.12)"
      }
    };
  },
  { name: "SonnatActionBar" }
);

export default useStyles;
