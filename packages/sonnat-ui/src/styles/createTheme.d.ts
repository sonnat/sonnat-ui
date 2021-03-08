import { CSSProperties } from "react";
import { Breakpoints, BreakpointsInputs } from "./createBreakpoints";
import { Colors, ColorsInputs } from "./createColors";
import { Mixins, MixinsInputs } from "./createMixins";
import { Spacings, SpacingsInputs } from "./createSpacings";
import { Typography, TypographyInputs } from "./createTypography";
import { ZIndexes, ZIndexesInputs } from "./createZIndexes";

export type Direction = "ltr" | "rtl";

export interface ThemeOptions {
  breakpoints?: BreakpointsInputs;
  direction?: Direction;
  mixins?: MixinsInputs;
  colors?: ColorsInputs;
  spacing?: SpacingsInputs;
  typography?: TypographyInputs;
  zIndex?: ZIndexesInputs;
  darkMode?: boolean;
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
  icons: { variable: any };
  hacks: {
    safariTransitionRadiusOverflowCombinationFix: CSSProperties;
    backfaceVisibilityFix: CSSProperties;
  };
}

// eslint-disable-next-line no-unused-vars
export default function createTheme(options?: ThemeOptions): Theme;
