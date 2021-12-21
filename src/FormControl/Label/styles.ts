import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.setText({
        fontWeight: theme.typography.fontWeight.medium,
        color: theme.colors.text.primary
      }),
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction],
      paddingBottom: theme.typography.pxToRem(8)
    },
    requiredIndicator: {
      color: theme.darkMode
        ? theme.colors.error.origin
        : theme.colors.error.light,
      ...(theme.direction === "rtl"
        ? { marginRight: theme.typography.pxToRem(4) }
        : { marginLeft: theme.typography.pxToRem(4) })
    },
    disabled: {}
  }),
  { name: "SonnatFormControlLabel" }
);

export default useStyles;
