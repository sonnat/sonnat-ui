import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      typography: { variants, pxToRem, fontFamily, fontWeight }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        width: "100%",
        overflowX: "auto",
        borderRadius: pxToRem(4),
        border: `1px solid ${colors.divider}`
      },
      table: {
        display: "table",
        width: "100%",
        borderCollapse: "collapse",
        borderSpacing: 0,
        captionSide: "bottom"
      },
      caption: {
        ...variants.caption,
        fontWeight: fontWeight.medium,
        textAlign: "inherit",
        padding: pxToRem(16),
        color: colors.text.secondary
      },
      dense: {
        "& $caption": {
          padding: pxToRem(8)
        }
      },
      borderLess: { border: "none" }
    };
  },
  { name: "SonnatTable" }
);

export default useStyles;
