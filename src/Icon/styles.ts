import makeStyles from "../styles/makeStyles";

export type ColorCombo =
  | "inheritColor"
  | "textPrimaryColor"
  | "textSecondaryColor"
  | "textHintColor"
  | "textDisabledColor"
  | "primaryColor"
  | "secondaryColor"
  | "errorColor"
  | "successColor"
  | "warningColor"
  | "infoColor";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      colors,
      direction,
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        direction,
        userSelect: "none",
        speak: "none",
        display: "inline-block",
        verticalAlign: "middle",
        fontStyle: "normal",
        fontWeight: "normal",
        fontVariant: "normal",
        textTransform: "none",
        lineHeight: "1",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textDecoration: "none",
        fill: "currentColor",
        fontSize: pxToRem(14)
      },
      defaultSize: {
        width: pxToRem(16),
        height: pxToRem(16),
        minWidth: pxToRem(16),
        minHeight: pxToRem(16)
      },
      inheritColor: { color: "inherit" },
      textPrimaryColor: { color: colors.text.primary },
      textSecondaryColor: { color: colors.text.secondary },
      textHintColor: { color: colors.text.hint },
      textDisabledColor: { color: colors.text.disabled },
      primaryColor: {
        color: !darkMode ? colors.primary.origin : colors.primary.light
      },
      secondaryColor: {
        color: !darkMode ? colors.secondary.origin : colors.secondary.light
      },
      errorColor: {
        color: !darkMode ? colors.error.origin : colors.error.light
      },
      successColor: {
        color: !darkMode ? colors.success.origin : colors.success.light
      },
      warningColor: {
        color: !darkMode ? colors.warning.origin : colors.warning.light
      },
      infoColor: { color: !darkMode ? colors.info.origin : colors.info.light }
    };
  },
  { name: "SonnatIcon" }
);

export default useStyles;
