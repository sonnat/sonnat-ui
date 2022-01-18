import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      radius,
      typography: { fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        borderRadius: radius.small,
        backgroundColor: !darkMode
          ? colors.background.origin
          : colors.background.accents[1]
      },
      outlined: { border: `1px solid ${colors.divider}` },
      elevated: {
        boxShadow: [
          "0 0 4px 0 rgba(0, 0, 0, 0.04)",
          "0 4px 12px 0 rgba(0, 0, 0, 0.04)",
          "0 2px 8px 0 rgba(0, 0, 0, 0.08)"
        ].join(", ")
      }
    };
  },
  { name: "SonnatCard" }
);

export default useStyles;
