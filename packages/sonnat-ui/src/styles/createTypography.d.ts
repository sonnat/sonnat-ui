import * as React from "react";

export type VariantNames =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "title"
  | "titleSmall"
  | "body"
  | "bodySmall"
  | "caption"
  | "captionSmall";

export interface VariantProps {
  h1: React.CSSProperties;
  h2: React.CSSProperties;
  h3: React.CSSProperties;
  h4: React.CSSProperties;
  h5: React.CSSProperties;
  h6: React.CSSProperties;
  subtitle: React.CSSProperties;
  subtitleSmall: React.CSSProperties;
  body: React.CSSProperties;
  bodySmall: React.CSSProperties;
  caption: React.CSSProperties;
  captionSmall: React.CSSProperties;
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
    fontSize?: React.CSSProperties["fontSize"];
    fontWeight?: React.CSSProperties["fontWeight"];
    lineHeight?: React.CSSProperties["lineHeight"];
    color?: React.CSSProperties["color"];
  }) => React.CSSProperties;
  pxToRem: (size: number) => string;
  remToPx: (size: number) => string;
  variants: VariantProps;
}

export default function createTypography(
  typography: TypographyInputs
): Typography;
