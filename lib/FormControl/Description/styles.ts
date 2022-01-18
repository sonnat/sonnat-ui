import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.variants.bodySmall,
      color: theme.colors.text.secondary,
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction],
      marginBottom: theme.spacings.spaces[3].rem
    },
    disabled: {}
  }),
  { name: "SonnatFormControlDescription" }
);

export default useStyles;
