import * as React from "react";
import type { AnyObject, EmptyIntersectionObject } from "../typings";
import createBreakpoints, {
  type Breakpoints,
  type BreakpointsInput
} from "./createBreakpoints";
import createColors, { type Colors, type ColorsInput } from "./createColors";
import createMixins, { type Mixins } from "./createMixins";
import createSpacings, { type Spacings } from "./createSpacings";
import createTypography, {
  type Typography,
  type TypographyInput
} from "./createTypography";
import createZIndexes, { type ZIndexes } from "./createZIndexes";
import swatches, { type Swatches } from "./swatches";

export type Direction = "ltr" | "rtl";

export interface ThemeInput {
  breakpoints: BreakpointsInput;
  colors: ColorsInput;
  typography: TypographyInput;
  mixins: Partial<Mixins>;
  spacings: Partial<Spacings>;
  zIndexes: Partial<ZIndexes>;
  direction: Direction;
  darkMode: boolean;
}

export interface Theme {
  mixins: ThemeInput["mixins"] & Mixins;
  spacings: ThemeInput["spacings"] & Spacings;
  zIndexes: ThemeInput["zIndexes"] & ZIndexes;
  breakpoints: Breakpoints;
  direction: Direction;
  colors: Colors;
  typography: Typography;
  darkMode: boolean;
  swatches: Swatches;
  hacks: {
    safariTransitionRadiusOverflowCombinationFix: React.CSSProperties;
    backfaceVisibilityFix: React.CSSProperties;
  };
}

const createTheme = <CustomProps extends AnyObject = EmptyIntersectionObject>(
  themeInput?: Partial<ThemeInput> & {
    custom?: CustomProps | ((theme: Theme) => CustomProps);
  }
): Theme & { custom: CustomProps } => {
  const {
    breakpoints: breakpointsInput,
    typography: typographyInput,
    colors: colorsInput,
    spacings: spacingsInput,
    zIndexes: zIndexesInput,
    mixins: mixinsInput,
    darkMode: isDarkMode = false,
    direction = "ltr",
    custom: customInput
  } = themeInput || {};

  const breakpoints = createBreakpoints(breakpointsInput);
  const colors = createColors(colorsInput, isDarkMode);
  const typography = createTypography(typographyInput);
  const spacings = createSpacings(spacingsInput);
  const mixins = createMixins(mixinsInput, {
    pxToRem: typography.pxToRem
  });
  const zIndexes = createZIndexes(zIndexesInput);

  const backfaceVisibilityFix: React.CSSProperties = {
    WebkitBackfaceVisibility: "hidden",
    MozBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
    WebkitTransform: "translate3d(0, 0, 0)",
    msTransform: "translate3d(0, 0, 0)",
    transform: "translate3d(0, 0, 0)"
  };

  const hacks = {
    /**
     * Use on the element with overflow.
     * Also add negative-index for the image and a higher value for the parent,
     * In case of image overflow-bug.
     */
    safariTransitionRadiusOverflowCombinationFix: backfaceVisibilityFix,
    backfaceVisibilityFix
  };

  const thisTheme = {
    colors,
    typography,
    spacings,
    breakpoints,
    mixins,
    zIndexes,
    direction,
    swatches,
    hacks,
    darkMode: isDarkMode
  };

  return {
    ...thisTheme,
    custom: customInput
      ? typeof customInput === "function"
        ? customInput(thisTheme)
        : customInput
      : ({} as CustomProps)
  };
};

export default createTheme;
