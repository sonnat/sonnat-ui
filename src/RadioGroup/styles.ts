import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => ({
    root: {
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction],
      display: "flex",
      flexWrap: "wrap"
    },
    column: { flexDirection: "column" },
    row: { flexDirection: "row" }
  }),
  { name: "SonnatRadioGroup" }
);

export default useStyles;
