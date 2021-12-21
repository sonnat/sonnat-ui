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
        padding: pxToRem(16),
        alignItems: "center"
      },
      body: {
        flex: [[1, 1, "auto"]]
      },
      action: {
        flex: [[0, 0, "auto"]],
        alignSelf: "flex-start",
        ...{
          ltr: { marginLeft: pxToRem(8) },
          rtl: { marginRight: pxToRem(8) }
        }[direction]
      }
    };
  },
  { name: "SonnatCardHeader" }
);

export default useStyles;
