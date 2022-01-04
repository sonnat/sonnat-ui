import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      spacings: { spaces },
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: { overflow: "hidden" },
      list: {
        direction,
        fontFamily: fontFamily[direction],
        padding: "0",
        margin: "0",
        listStyle: "none",
        display: "flex",
        height: pxToRem(24),
        flexWrap: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
        width: "100%",
        position: "relative",
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
        "& > $item:last-child": {
          margin: 0,
          color: colors.text.hint,
          pointerEvents: "none",
          "& > [role='separator']": { display: "none" }
        }
      },
      onlyPreviousStep: {
        "& > $item:not(:nth-last-child(2))": { display: "none" },
        "& > $item:nth-last-child(2)": {
          margin: 0,
          "&:hover": {
            "& > [role='separator']": {
              color: colors.text.primary,
              transform: "rotate(180deg)"
            },
            "& ~ $item > [role='separator']": { transform: "rotate(0)" }
          },
          "& > [role='separator']": {
            order: "-1",
            transform: "rotate(180deg)",
            ...(direction === "rtl"
              ? { marginLeft: spaces[1].rem }
              : { marginRight: spaces[1].rem })
          }
        }
      },
      item: {}
    };
  },
  { name: "SonnatBreadcrumb" }
);

export default useStyles;
