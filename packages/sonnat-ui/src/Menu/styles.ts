import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      zIndexes,
      direction,
      typography: { pxToRem, setText, fontFamily }
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
        marginTop: pxToRem(4),
        width: "100%",
        height: "100%",
        borderRadius: pxToRem(4),
        boxShadow: !darkMode ? boxShadow.lightMode : boxShadow.darkMode,
        backgroundColor: !darkMode
          ? colors.background.origin
          : colors.background.level[1],
        zIndex: 1
      },
      searchRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: `${pxToRem(4)} ${pxToRem(4)} 0 0`,
        padding: pxToRem(4)
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
        borderBottom: `1px solid ${colors.divider}`,
        "&:last-child": {
          borderBottom: "none"
        }
      },
      option: {
        "& + $group": {
          borderTop: `1px solid ${colors.divider}`
        }
      },
      emptyStatement: {
        ...setText({
          fontSize: pxToRem(14),
          lineHeight: 1.5714285714,
          color: colors.text.hint
        }),
        display: "flex",
        alignItems: "center",
        height: pxToRem(40),
        justifyContent: "center",
        textAlign: "center"
      },
      searchable: {
        "&$dense $list": {
          height: `calc(100% - ${pxToRem(40)})`
        },
        "&:not($dense) $list": {
          height: `calc(100% - ${pxToRem(48)})`
        }
      },
      dense: {
        "& $list": {
          maxHeight: pxToRem(256)
        }
      }
    };
  },
  { name: "SonnatMenu" }
);

export default useStyles;
