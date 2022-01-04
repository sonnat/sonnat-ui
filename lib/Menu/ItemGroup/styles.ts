import makeStyles from "../../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      spacings: { spaces },
      typography: { pxToRem, setText }
    } = theme;

    return {
      root: {},
      title: {
        ...setText({
          fontSize: pxToRem(14),
          lineHeight: 1.5714285714,
          color: colors.text.primary
        }),
        paddingRight: spaces[7].rem,
        paddingLeft: spaces[7].rem,
        height: pxToRem(40),
        flexGrow: "1",
        display: "flex",
        alignItems: "center"
      },
      dense: { "& $title": { height: pxToRem(32), fontSize: pxToRem(12) } },
      hide: { display: "none" }
    };
  },
  { name: "SonnatMenuItemGroup" }
);

export default useStyles;
