import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => ({
    root: {
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction],
      display: "inline-flex",
      flexDirection: "column",
      position: "relative",
      verticalAlign: "top",
      alignItems: "flex-start"
    },
    fluid: { width: "100%" }
  }),
  { name: "SonnatFormControl" }
);

export default useStyles;
