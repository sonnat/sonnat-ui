import type { CSSProperties } from "react";
import type { Breakpoints, BreakpointsInputs } from "./createBreakpoints";
import type { Colors, ColorsInputs } from "./createColors";
import type { Mixins, MixinsInputs } from "./createMixins";
import type { Spacings, SpacingsInputs } from "./createSpacings";
import type { Typography, TypographyInputs } from "./createTypography";
import type { ZIndexes, ZIndexesInputs } from "./createZIndexes";

export type Direction = "ltr" | "rtl";

export interface ThemeOptions {
  breakpoints: BreakpointsInputs;
  direction: Direction;
  mixins: MixinsInputs;
  colors: ColorsInputs;
  spacing: SpacingsInputs;
  typography: TypographyInputs;
  zIndex: ZIndexesInputs;
  darkMode: boolean;
}

export interface Theme {
  breakpoints: Breakpoints;
  direction: Direction;
  mixins: Mixins;
  colors: Colors;
  spacings: Spacings;
  typography: Typography;
  zIndexes: ZIndexes;
  darkMode: boolean;
  hacks: {
    safariTransitionRadiusOverflowCombinationFix: CSSProperties;
    backfaceVisibilityFix: CSSProperties;
  };
}

// eslint-disable-next-line no-unused-vars
export default function createTheme(options?: Partial<ThemeOptions>): Theme;
