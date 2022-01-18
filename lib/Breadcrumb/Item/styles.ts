import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      spacings: { spaces },
      mixins: { asIconWrapper },
      hacks: { backfaceVisibilityFix },
      typography: { pxToRem, variants }
    } = theme;

    return {
      root: {
        ...variants.caption,
        color: colors.text.secondary,
        maxWidth: pxToRem(120),
        display: "inline-flex",
        alignItems: "center",
        flexShrink: "0",
        cursor: "pointer",
        transition: "color 360ms ease",
        ...(direction === "rtl"
          ? { marginLeft: spaces[1].rem }
          : { marginRight: spaces[1].rem }),
        "&:hover": {
          color: colors.text.primary,
          "& > $separator": {
            color: colors.text.primary,
            transform: "rotate(180deg)"
          },
          "& ~ $root > $separator": { transform: "rotate(180deg)" }
        }
      },
      content: {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        "& > a": { textDecoration: "none", color: "inherit" }
      },
      separator: {
        ...asIconWrapper(16),
        ...backfaceVisibilityFix,
        color: colors.text.secondary,
        flexShrink: "0",
        transition: "color 360ms ease, transform 360ms ease"
      }
    };
  },
  { name: "SonnatBreadcrumbItem" }
);

export default useStyles;
