/* eslint-disable no-unused-vars */
import { CSSProperties } from "react";

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
  h1: CSSProperties;
  h2: CSSProperties;
  h3: CSSProperties;
  h4: CSSProperties;
  h5: CSSProperties;
  h6: CSSProperties;
  subtitle: CSSProperties;
  subtitleSmall: CSSProperties;
  body: CSSProperties;
  bodySmall: CSSProperties;
  caption: CSSProperties;
  captionSmall: CSSProperties;
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
    fontSize?: CSSProperties["fontSize"];
    fontWeight?: CSSProperties["fontWeight"];
    lineHeight?: CSSProperties["lineHeight"];
    color?: CSSProperties["color"];
  }) => CSSProperties;
  pxToRem: (size: number) => string;
  remToPx: (size: number) => string;
  variants: VariantProps;
}

export default function createTypography(
  typography: TypographyInputs
): Typography;
