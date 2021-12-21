import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "block",
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.12 })
          : colors.createWhiteColor({ alpha: 0.12 }),
        height: "1.2em",
        animation: "$pulse 1.5s ease-in-out 0.5s infinite"
      },
      text: {
        marginTop: 0,
        marginBottom: 0,
        height: "auto",
        transformOrigin: "0 55%",
        transform: "scale(1, 0.60)",
        borderRadius: pxToRem(4),
        "&:empty:before": {
          content: '"\\00a0"'
        }
      },
      circular: {
        borderRadius: "50%"
      },
      rectangular: { borderRadius: pxToRem(4) },
      autoHeight: {
        height: "auto"
      },
      autoWidth: {
        maxWidth: "fit-content"
      },
      hasChildren: {
        "& > *": {
          visibility: "hidden"
        }
      },
      "@keyframes pulse": {
        "0%": {
          opacity: 1
        },
        "50%": {
          opacity: 0.4
        },
        "100%": {
          opacity: 1
        }
      }
    };
  },
  { name: "SonnatSkeleton" }
);

export default useStyles;
