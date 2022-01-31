import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.variants.caption,
      color: !theme.darkMode
        ? theme.colors.text.dark.secondary
        : theme.colors.text.light.secondary,
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
