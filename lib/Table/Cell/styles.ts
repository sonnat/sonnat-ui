import makeStyles from "../../styles/makeStyles";

export type AlignCombo =
  | "textAlignCenter"
  | "textAlignInherit"
  | "textAlignJustify"
  | "textAlignLeft"
  | "textAlignRight";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      spacings: { spaces },
      colors: { text, divider },
      typography: { variants }
    } = theme;

    return {
      root: {
        display: "table-cell",
        verticalAlign: "inherit",
        borderBottom: `1px solid ${!darkMode ? divider.dark : divider.light}`,
        padding: spaces[7].rem
      },
      bodyCell: {
        ...variants.body,
        color: !darkMode ? text.dark.primary : text.light.primary
      },
      headerCell: {
        ...variants.subtitle,
        color: !darkMode ? text.dark.primary : text.light.primary,
        borderBottomColor: darkMode
          ? "rgba(255, 255, 255, 0.24)"
          : "rgba(0, 0, 0, 0.24)"
      },
      footerCell: {
        ...variants.caption,
        color: !darkMode ? text.dark.secondary : text.light.secondary
      },
      textAlignCenter: { textAlign: "center" },
      textAlignInherit: { textAlign: "inherit" },
      textAlignJustify: { textAlign: "justify" },
      textAlignLeft: { textAlign: "left" },
      textAlignRight: { textAlign: "right" },
      dense: { padding: spaces[3].rem },
      selected: { color: "inherit" }
    };
  },
  { name: "SonnatTableCell" }
);

export default useStyles;
