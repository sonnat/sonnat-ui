import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      typography: { pxToRem }
    } = theme;

    return { root: { padding: pxToRem(16) } };
  },
  { name: "SonnatCardBody" }
);

export default useStyles;
