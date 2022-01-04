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
      colors,
      darkMode,
      spacings: { spaces },
      typography: { variants }
    } = theme;

    return {
      root: {
        display: "table-cell",
        verticalAlign: "inherit",
        borderBottom: `1px solid ${colors.divider}`,
        padding: spaces[7].rem
      },
      bodyCell: {
        ...variants.body,
        color: colors.text.primary
      },
      headerCell: {
        ...variants.subtitle,
        color: colors.text.primary,
        borderBottomColor: darkMode
          ? "rgba(255, 255, 255, 0.24)"
          : "rgba(0, 0, 0, 0.24)"
      },
      footerCell: {
        ...variants.caption,
        color: colors.text.secondary
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
