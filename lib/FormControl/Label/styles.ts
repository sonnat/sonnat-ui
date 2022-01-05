import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.variants.subtitle,
      color: theme.colors.text.primary,
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction],
      paddingBottom: theme.spacings.spaces[3].rem
    },
    requiredIndicator: {
      color: theme.darkMode
        ? theme.colors.error.origin
        : theme.colors.error.light,
      ...(theme.direction === "rtl"
        ? { marginRight: theme.spacings.spaces[1].rem }
        : { marginLeft: theme.spacings.spaces[1].rem })
    },
    disabled: {}
  }),
  { name: "SonnatFormControlLabel" }
);

export default useStyles;
