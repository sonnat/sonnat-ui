import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.variants.caption,
      color: theme.colors.text.secondary,
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction],
      marginTop: theme.spacings.spaces[1].rem
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
