import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      darkMode,
      direction,
      mixins: { asIconWrapper },
      colors: { text, transparent, primary },
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "flex",
        position: "relative",
        overflow: "hidden"
      },
      scrollBehavior: {
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch"
      },
      listWrapper: {
        extend: "scrollBehavior",
        flex: [[1, 0]],
        margin: 0,
        display: "flex",
        position: "relative",
        minHeight: pxToRem(64),
        alignItems: "flex-start",
        justifyContent: "flex-start",
        zIndex: "1",
        "&::-webkit-scrollbar-track": {
          display: "none",
          backgroundColor: transparent
        },
        "&::-webkit-scrollbar": {
          display: "none",
          backgroundColor: transparent
        },
        "&::-webkit-scrollbar-thumb": {
          display: "none",
          backgroundColor: transparent
        },
        "&::-webkit-scrollbar-thumb:hover": {
          display: "none",
          backgroundColor: transparent
        }
      },
      listContainer: {
        extend: "scrollBehavior",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        "&::-webkit-scrollbar-track": {
          display: "none",
          backgroundColor: transparent
        },
        "&::-webkit-scrollbar": {
          display: "none",
          backgroundColor: transparent
        },
        "&::-webkit-scrollbar-thumb": {
          display: "none",
          backgroundColor: transparent
        },
        "&::-webkit-scrollbar-thumb:hover": {
          display: "none",
          backgroundColor: transparent
        }
      },
      indicatorSlider: {
        left: 0,
        bottom: 0,
        height: pxToRem(2),
        zIndex: 2,
        width: "100%",
        content: '""',
        position: "absolute",
        transition:
          "transform 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 125ms ease 250ms, left 250ms cubic-bezier(0.4, 0, 0.2, 1)",
        backgroundColor: transparent,
        transformOrigin: "0% 0%"
      },
      fader: {
        backgroundColor: transparent,
        zIndex: 2,
        display: "flex",
        width: pxToRem(32),
        minWidth: pxToRem(32),
        height: "100%",
        position: "relative",
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: "0",
        "&:hover": {
          "& $faderIcon": { color: !darkMode ? primary.origin : primary.light }
        }
      },
      startFader: {},
      endFader: {},
      large: {
        height: pxToRem(48),
        "& $indicatorSlider": { top: pxToRem(48) }
      },
      medium: {
        height: pxToRem(40),
        "& $indicatorSlider": { top: pxToRem(40) }
      },
      small: {
        height: pxToRem(32),
        "& $indicatorSlider": { top: pxToRem(32) }
      },
      disabledFader: {
        visibility: "hidden"
      },
      faderIcon: {
        ...asIconWrapper(16),
        color: !darkMode ? text.dark.hint : text.light.hint,
        transition: "color 360ms ease"
      },
      scrollable: { "& $listWrapper": { overflowX: "auto" } },
      fluid: {
        width: "100%",
        "& $listContainer": { flex: [[1, 0]] }
      }
    };
  },
  { name: "SonnatTabBar" }
);

export default useStyles;
