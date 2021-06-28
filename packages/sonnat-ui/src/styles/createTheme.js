import { deepMerge } from "../utils";
import createTypography from "./createTypography";
import createColors from "./createColors";
import createSpacings from "./createSpacings";
import createBreakpoints from "./createBreakpoints";
import createMixins from "./createMixins";
import createZIndexes from "./createZIndexes";

export default (options = {}) => {
  const {
    breakpoints: breakpointsInput = {},
    typography: typographyInput = {},
    colors: colorsInput = {},
    spacings: spacingsInput = {},
    mixins: mixinsInput = {},
    zIndexes: zIndexesInput = {},
    darkMode: isDarkMode = false,
    direction = "ltr",
    ...otherOptions
  } = options;

  const breakpoints = createBreakpoints(breakpointsInput);
  const colors = createColors(
    { ...colorsInput },
    isDarkMode ? "dark" : "light"
  );
  const typography = createTypography(typographyInput);
  const spacings = createSpacings(spacingsInput, {
    pxToRem: typography.pxToRem
  });
  const mixins = createMixins(mixinsInput, {
    pxToRem: typography.pxToRem
  });
  const zIndexes = createZIndexes(zIndexesInput);

  const backfaceVisibilityFix = {
    WebkitBackfaceVisibility: "hidden",
    MozBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
    WebkitTransform: "translate3d(0, 0, 0)",
    MozTransform: "translate3d(0, 0, 0)",
    transform: "translate3d(0, 0, 0)"
  };

  const hacks = {
    // Use on the element with overflow
    // Also add negative-index for the image and a higher value for the parent,
    // In case of image overflow-bug.
    safariTransitionRadiusOverflowCombinationFix: backfaceVisibilityFix,
    backfaceVisibilityFix
  };

  const theme = deepMerge(
    {
      colors,
      typography,
      spacings,
      breakpoints,
      mixins,
      zIndexes,
      direction,
      hacks,
      darkMode: isDarkMode
    },
    otherOptions
  );

  return theme;
};
