import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => ({
    root: {
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction],
      marginTop: theme.spacings.spaces[1].rem,
      ...theme.typography.setText({
        fontSize: theme.typography.pxToRem(12),
        lineHeight: 1.6666666667,
        color: theme.colors.text.secondary
      })
    },
    errored: {
      color: !theme.darkMode
        ? theme.colors.error.origin
        : theme.colors.error.light
    }
  }),
  { name: "SonnatFormControlFeedback" }
);

export default useStyles;
