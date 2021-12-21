import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.setText({
        fontSize: theme.typography.pxToRem(14),
        lineHeight: 1.5714285714,
        color: theme.colors.text.secondary
      }),
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction],
      marginBottom: theme.typography.pxToRem(8)
    },
    disabled: {}
  }),
  { name: "SonnatFormControlDescription" }
);

export default useStyles;
