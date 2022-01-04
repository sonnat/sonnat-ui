import makeStyles from "../styles/makeStyles";

export type PositionCombo =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export type VariantColorCombo =
  | "filledPrimary"
  | "filledSecondary"
  | "dottedPrimary"
  | "dottedSecondary";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      hacks,
      radius,
      spacings: { spaces },
      typography: { pxToRem, fontWeight, setText, fontFamily }
    } = theme;

    return {
      root: {
        ...hacks.safariTransitionRadiusOverflowCombinationFix,
        position: "relative",
        flexShrink: 0,
        verticalAlign: "middle"
      },
      standalone: {
        transform: "scale(0)",
        visibility: "hidden",
        opacity: 0,
        transformOrigin: "100% 0",
        transition: `transform 360ms ease,
          visibility 360ms ease,
          opacity 360ms ease`
      },
      relative: {
        display: "inline-flex",
        "& > $standalone": {
          position: "absolute"
        }
      },
      visible: {
        visibility: "visible",
        opacity: 1,
        transform: "scale(1)"
      },
      notDottedBadge: {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        ...setText({
          fontSize: pxToRem(10),
          fontWeight: fontWeight.medium,
          lineHeight: 1
        }),
        direction,
        fontFamily: fontFamily[direction],
        minWidth: pxToRem(16),
        height: pxToRem(16),
        borderRadius: radius.medium,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${spaces[1].rem}`
      },
      filled: { extend: "notDottedBadge" },
      dotted: { borderRadius: radius.rounded, display: "inline-block" },
      filledPrimary: {
        backgroundColor: !darkMode
          ? colors.primary.origin
          : colors.primary.light,
        color: colors.getContrastColorOf(
          !darkMode ? colors.primary.origin : colors.primary.light
        )
      },
      filledSecondary: {
        backgroundColor: !darkMode
          ? colors.secondary.origin
          : colors.secondary.light,
        color: colors.getContrastColorOf(
          !darkMode ? colors.secondary.origin : colors.secondary.light
        )
      },
      dottedPrimary: {
        backgroundColor: !darkMode
          ? colors.primary.origin
          : colors.primary.light
      },
      dottedSecondary: {
        backgroundColor: !darkMode
          ? colors.secondary.origin
          : colors.secondary.light
      },
      large: { width: pxToRem(12), height: pxToRem(12) },
      medium: { width: pxToRem(8), height: pxToRem(8) },
      small: { width: pxToRem(4), height: pxToRem(4) },
      anchorElement: {},
      rectangularOverlapping: {},
      circularOverlapping: {},
      topLeft: {
        top: 0,
        left: 0,
        "&$rectangularOverlapping": { top: "0", left: "0" },
        "&$circularOverlapping": { top: "15%", left: "15%" },
        "&$visible": { transform: "scale(1) translate(-50%, -50%)" },
        "&:not($visible)": { transform: "scale(0) translate(-50%, -50%)" }
      },
      topRight: {
        top: 0,
        right: 0,
        "&$rectangularOverlapping": { top: "0", right: "0" },
        "&$circularOverlapping": { top: "15%", right: "15%" },
        "&$visible": { transform: "scale(1) translate(50%, -50%)" },
        "&:not($visible)": { transform: "scale(0) translate(50%, -50%)" }
      },
      bottomLeft: {
        bottom: 0,
        left: 0,
        "&$rectangularOverlapping": { bottom: "0", left: "0" },
        "&$circularOverlapping": { bottom: "15%", left: "15%" },
        "&$visible": { transform: "scale(1) translate(-50%, 50%)" },
        "&:not($visible)": { transform: "scale(0) translate(-50%, 50%)" }
      },
      bottomRight: {
        bottom: 0,
        right: 0,
        "&$rectangularOverlapping": { bottom: "0", right: "0" },
        "&$circularOverlapping": { bottom: "15%", right: "15%" },
        "&$visible": { transform: "scale(1) translate(50%, 50%)" },
        "&:not($visible)": { transform: "scale(0) translate(50%, 50%)" }
      }
    };
  },
  { name: "SonnatBadge" }
);

export default useStyles;
