import { lighten } from "../../styles/colorUtils";
import makeStyles from "../../styles/makeStyles";

export type AlignCombo =
  | "verticalAlignMiddle"
  | "verticalAlignTop"
  | "verticalAlignBottom";

const useStyles = makeStyles(
  theme => {
    const { colors, darkMode } = theme;

    const selectedBgColor = !darkMode
      ? colors.primary.origin
      : colors.primary.light;

    return {
      root: {
        display: "table-row",
        outline: "none",
        color: "inherit",
        transition: "background-color 180ms ease"
      },
      verticalAlignMiddle: { verticalAlign: "middle" },
      verticalAlignTop: { verticalAlign: "top" },
      verticalAlignBottom: { verticalAlign: "bottom" },
      selected: {
        color: colors.getContrastColorOf(selectedBgColor),
        backgroundColor: selectedBgColor,
        "&$hoverable:hover": {
          backgroundColor: lighten(selectedBgColor, 0.15)
        }
      },
      hoverable: {
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 }, true)
            : colors.createWhiteColor({ alpha: 0.04 }, true)
        }
      }
    };
  },
  { name: "SonnatTableRow" }
);

export default useStyles;
