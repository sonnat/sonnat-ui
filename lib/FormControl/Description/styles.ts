import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.variants.bodySmall,
      color: !theme.darkMode
        ? theme.colors.text.dark.primary
        : theme.colors.text.light.primary,
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction],
      marginBottom: theme.spacings.spaces[3].rem
    },
    disabled: {}
  }),
  { name: "SonnatFormControlDescription" }
);

export default useStyles;
