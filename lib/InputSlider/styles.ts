import { changeColorHsla } from "../styles/colorUtils";
import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      hacks,
      radius,
      swatches: { blue, grey },
      mixins: { asIconWrapper },
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        position: "relative",
        height: pxToRem(52),
        direction: "ltr",
        width: `calc(100% - ${pxToRem(36)})`,
        margin: "0 auto"
      },
      wrapper: {
        height: "100%",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        display: "flex",
        alignItems: "center",
        "&:after": {
          content: '""',
          zIndex: 0,
          height: pxToRem(2),
          borderRadius: radius.xSmall,
          backgroundColor: colors.divider,
          width: "100%",
          position: "absolute"
        }
      },
      steps: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row-reverse",
        position: "absolute",
        left: 0,
        right: 0
      },
      step: {
        display: "inline-flex",
        alignItems: "center",
        position: "absolute",
        transition: "right 160ms ease",
        "&:after": {
          content: '""',
          backgroundColor: colors.text.hint,
          width: pxToRem(2),
          height: pxToRem(2),
          borderRadius: radius.rounded,
          transform: `translateX(1px)`
        }
      },
      interval: {
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        height: "100%",
        position: "absolute",
        zIndex: 2,
        left: 0,
        right: 0,
        marginRight: pxToRem(-18),
        marginLeft: pxToRem(-18)
      },
      handle: {
        ...hacks.safariTransitionRadiusOverflowCombinationFix,
        width: pxToRem(36),
        height: pxToRem(36),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        position: "absolute",
        cursor: "pointer",
        transition: "right 160ms ease, left 160ms ease",
        "&:after": {
          content: '""',
          position: "absolute",
          left: "0",
          top: "0",
          width: "100%",
          height: "100%",
          borderRadius: radius.rounded,
          opacity: "0",
          transform: "scale(0)",
          transition:
            "transform 240ms ease, opacity 240ms ease, background-color 240ms ease"
        },
        "&:not($focusVisible):hover:after": {
          backgroundColor: colors.createPrimaryColor({ alpha: 0.04 }),
          opacity: 1,
          transform: "scale(1)"
        }
      },
      supHandle: { right: 0 },
      infHandle: { left: 0 },
      handleCircle: {
        width: pxToRem(20),
        height: pxToRem(20),
        boxShadow: `0 0 0 1px rgba(0, 0, 0, 0.12)`,
        backgroundColor: colors.white,
        borderRadius: radius.rounded,
        zIndex: 1,
        position: "relative",
        cursor: "pointer",
        appearance: "none !important",
        border: "none",
        padding: "0",
        outline: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 360ms ease, box-shadow 360ms ease",
        "&:active": {
          backgroundColor: !darkMode
            ? colors.primary.origin
            : colors.primary.light,
          boxShadow: `0 0 0 1px ${
            !darkMode ? colors.primary.origin : colors.primary.light
          }`,
          "& $handleIcon": { color: colors.white }
        }
      },
      handleIcon: {
        ...asIconWrapper(16),
        color: colors.createBlackColor({ alpha: 0.56 }, true),
        transition: "color 360ms ease"
      },
      track: {
        position: "absolute",
        left: 0,
        right: 0,
        height: pxToRem(2),
        borderRadius: radius.xSmall,
        backgroundColor: !darkMode
          ? colors.primary.origin
          : colors.primary.light,
        marginRight: pxToRem(18),
        marginLeft: pxToRem(18),
        transform: `translateX(${pxToRem(-1)})`,
        transition: "left 160ms ease, right 160ms ease"
      },
      continuous: {},
      discrete: {},
      disabled: {
        pointerEvents: "none",
        "& $handleCircle, & $track": {
          backgroundColor: !darkMode ? grey[400] : grey[600]
        },
        "& $handleCircle": { boxShadow: "none" },
        "& $handle:after": {
          transform: "scale(0.8)",
          backgroundColor: !darkMode
            ? "rgba(255, 255, 255, 0.7)"
            : changeColorHsla(colors.background.origin, { alpha: 0.56 }),
          opacity: 1
        },
        "& $handleIcon": { color: !darkMode ? colors.white : colors.black },
        "& $wrapper:after": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.08 }, true)
            : colors.createWhiteColor({ alpha: 0.08 }, true)
        }
      },
      focusVisible: {
        outline: "none",
        "&:after": {
          backgroundColor: darkMode ? blue[500] : blue[600],
          opacity: darkMode ? 0.32 : 0.12,
          transform: "scale(1)"
        }
      }
    };
  },
  { name: "SonnatInputSlider" }
);

export default useStyles;
