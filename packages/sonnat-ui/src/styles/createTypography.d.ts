/* eslint-disable no-unused-vars */
import { CSSProperties } from "react";

export type VariantNames =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "heroText"
  | "titleText"
  | "bodyText"
  | "captionText";

type VariantSizes = "large" | "medium" | "small" | "extraSmall";
type VariantWeights = "bolder" | "lighter";

type OnlyNormalCSSRules = {
  rules: CSSProperties;
};

type WithResponsiveCSSRules = OnlyNormalCSSRules & {
  responsiveRules: CSSProperties;
};

export interface VariantProps {
  h1: WithResponsiveCSSRules;
  h2: OnlyNormalCSSRules;
  h3: WithResponsiveCSSRules;
  h4: WithResponsiveCSSRules;
  h5: OnlyNormalCSSRules;
  h6: OnlyNormalCSSRules;
  heroText: Record<
    Extract<VariantSizes, "large" | "medium" | "small">,
    Record<VariantWeights, WithResponsiveCSSRules> & WithResponsiveCSSRules
  >;
  titleText: Record<
    Extract<VariantSizes, "large" | "medium">,
    WithResponsiveCSSRules
  > &
    Record<Exclude<VariantSizes, "large" | "medium">, OnlyNormalCSSRules>;
  bodyText: {
    large: { lighter: WithResponsiveCSSRules } & WithResponsiveCSSRules;
    medium: { bolder: WithResponsiveCSSRules } & WithResponsiveCSSRules;
    small: { bolder: OnlyNormalCSSRules } & OnlyNormalCSSRules;
  };
  captionText: Record<
    Extract<VariantSizes, "large" | "medium">,
    Record<Extract<VariantWeights, "bolder">, OnlyNormalCSSRules> &
      OnlyNormalCSSRules
  > &
    Record<Extract<VariantSizes, "small">, OnlyNormalCSSRules>;
}

export interface FontWeights {
  light: number;
  regular: number;
  medium: number;
  bold: number;
}

export interface FontFamilies {
  ltr: string;
  rtl: string;
  monospace: string;
}

export interface TypographyInputs {
  fontSize?: number;
  htmlFontSize?: number;
  ltrFontFamily?: string;
  rtlFontFamily?: string;
  monospaceFontFamily?: string;
}

export interface Typography {
  fontWeight: FontWeights;
  fontFamily: FontFamilies;
  fontSize: number;
  htmlFontSize: number;
  useText: (textProperties: {
    fontSize?: string | number;
    fontWeight?: CSSProperties["fontWeight"];
    lineHeight?: string | number;
    color?: CSSProperties["color"];
  }) => CSSProperties;
  pxToRem: (size: number) => string;
  remToPx: (size: number) => string;
  variants: VariantProps;
}

export default function createTypography(
  typography: TypographyInputs
): Typography;
