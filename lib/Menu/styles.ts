import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      zIndexes,
      direction,
      radius,
      spacings: { spaces },
      colors: { text, divider, background },
      typography: { pxToRem, variants, fontFamily }
    } = theme;

    const boxShadow = {
      darkMode: `0 4px 4px -4px rgba(0, 0, 0, 0.12),
      0 8px 10px 1px rgba(0, 0, 0, 0.08),
      0 4px 8px 2px rgba(0, 0, 0, 0.04),
      0 0 0 1px rgba(0, 0, 0, 0.12)`,
      lightMode: `0 1px 6px 0 rgba(0, 0, 0, 0.04),
      0 -8px 32px -4px rgba(0, 0, 0, 0.08),
      0 16px 24px -6px rgba(0, 0, 0, 0.04)`
    };

    return {
      root: {
        position: "absolute",
        zIndex: zIndexes.popover,
        direction,
        fontFamily: fontFamily[direction],
        outline: "none"
      },
      container: {
        width: "100%",
        height: "100%",
        borderRadius: radius.small,
        boxShadow: !darkMode ? boxShadow.lightMode : boxShadow.darkMode,
        backgroundColor: !darkMode
          ? background.light.origin
          : background.dark.accents[1],
        zIndex: 1
      },
      searchRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: `${radius.small} ${radius.small} 0 0`,
        padding: spaces[1].rem
      },
      list: {
        width: "100%",
        height: "100%",
        maxHeight: pxToRem(320),
        overflow: "auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        outline: "none"
      },
      group: {
        borderBottom: `1px solid ${!darkMode ? divider.dark : divider.light}`,
        "&:last-child": { borderBottom: "none" }
      },
      option: {
        "& + $group": {
          borderTop: `1px solid ${!darkMode ? divider.dark : divider.light}`
        }
      },
      emptyStatement: {
        ...variants.bodySmall,
        color: !darkMode ? text.dark.hint : text.light.hint,
        display: "flex",
        alignItems: "center",
        height: pxToRem(40),
        justifyContent: "center",
        textAlign: "center"
      },
      searchable: {
        "&$dense $list": { height: `calc(100% - ${pxToRem(40)})` },
        "&:not($dense) $list": { height: `calc(100% - ${pxToRem(48)})` }
      },
      dense: { "& $list": { maxHeight: pxToRem(256) } }
    };
  },
  { name: "SonnatMenu" }
);

export default useStyles;
