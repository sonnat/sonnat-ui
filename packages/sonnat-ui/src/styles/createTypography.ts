import * as React from "react";

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

export interface Variants {
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

export interface Typography {
  fontWeight: FontWeights;
  fontFamily: FontFamilies;
  fontSize: number;
  htmlFontSize: number;
  variants: Variants;
  setText: (textProperties?: {
    fontSize?: React.CSSProperties["fontSize"];
    fontWeight?: React.CSSProperties["fontWeight"];
    lineHeight?: React.CSSProperties["lineHeight"];
    color?: React.CSSProperties["color"];
  }) => React.CSSProperties;
  pxToRem: (size: number) => string;
  remToPx: (size: number) => string;
}

export const sonnatRtlFontFamily =
  `IRANSans, Arial, Tahoma, Helvetica` as const;

export const sonnatLtrFontFamily =
  `"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI",
"Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
"Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` as const;

export const sonnatMonospaceFontFamily =
  `"Roboto Mono", "SFMono-Regular", "Menlo", "Monaco",
"Consolas", "Liberation Mono", "Courier New", "monospace"` as const;

export const sonnatFontSize = 16 as const;
export const sonnatHtmlFontSize = 16 as const;

export const sonnatFontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700
} as const;

export interface TypographyInput {
  fontSize?: Typography["fontSize"];
  htmlFontSize?: Typography["htmlFontSize"];
  ltrFontFamily?: Typography["fontFamily"]["ltr"];
  rtlFontFamily?: Typography["fontFamily"]["rtl"];
  monospaceFontFamily?: Typography["fontFamily"]["monospace"];
}

const createTypography = (typographyInput?: TypographyInput): Typography => {
  const {
    // The default font size of the Sonnat Specification.
    fontSize: systemFontSize = sonnatFontSize,
    htmlFontSize = sonnatHtmlFontSize,
    ltrFontFamily = sonnatLtrFontFamily,
    rtlFontFamily = sonnatRtlFontFamily,
    monospaceFontFamily = sonnatMonospaceFontFamily
  } = typographyInput || {};

  if (process.env.NODE_ENV !== "production") {
    if (typeof systemFontSize !== "number") {
      // eslint-disable-next-line no-console
      console.error("Sonnat: `fontSize` should be a number.");
    }

    if (typeof htmlFontSize !== "number") {
      // eslint-disable-next-line no-console
      console.error("Sonnat: `htmlFontSize` should be a number.");
    }
  }

  const coef = systemFontSize / sonnatFontSize;

  const pxToRem = (size: number): string =>
    typeof size === "number" && !isNaN(size)
      ? `${(size / htmlFontSize) * coef}rem`
      : "";
  const remToPx = (size: number): string =>
    typeof size === "number" && !isNaN(size)
      ? `${(size * htmlFontSize) / coef}px`
      : "";

  const setText: Typography["setText"] = (
    textProperties
  ): React.CSSProperties => {
    const {
      fontSize = pxToRem(systemFontSize),
      fontWeight = sonnatFontWeight.regular,
      lineHeight = 1.625,
      color
    } = textProperties || {};

    return {
      lineHeight,
      fontSize,
      fontWeight,
      color,
      margin: 0,
      fontStyle: "normal",
      fontFamily: "inherit",
      fontStretch: "normal",
      letterSpacing: "normal",
      MozTextSizeAdjust: "100%",
      WebkitTextSizeAdjust: "100%",
      textSizeAdjust: "100%"
    };
  };

  const buildVariant = (
    fontSize?: React.CSSProperties["fontSize"],
    fontWeight?: React.CSSProperties["fontWeight"],
    lineHeight?: React.CSSProperties["lineHeight"]
  ): React.CSSProperties =>
    setText({ fontSize: pxToRem(fontSize as number), fontWeight, lineHeight });

  const variants: Variants = {
    h1: buildVariant(56, 1.2857142857, sonnatFontWeight.medium),
    h2: buildVariant(48, 1.3333333333, sonnatFontWeight.medium),
    h3: buildVariant(32, 1.5, sonnatFontWeight.medium),
    h4: buildVariant(24, 1.6666666667, sonnatFontWeight.medium),
    h5: buildVariant(20, 1.8, sonnatFontWeight.medium),
    h6: buildVariant(18, 1.7777777778, sonnatFontWeight.medium),
    subtitle: buildVariant(16, 1.75, sonnatFontWeight.medium),
    subtitleSmall: buildVariant(14, 1.7142857143, sonnatFontWeight.medium),
    body: buildVariant(16, 1.625, sonnatFontWeight.regular),
    bodySmall: buildVariant(14, 1.5714285714, sonnatFontWeight.regular),
    caption: buildVariant(12, 1.6666666667, sonnatFontWeight.regular),
    captionSmall: buildVariant(10, 1.8, sonnatFontWeight.regular)
  };

  return {
    fontWeight: sonnatFontWeight,
    fontSize: systemFontSize,
    fontFamily: {
      ltr: ltrFontFamily,
      rtl: rtlFontFamily,
      monospace: monospaceFontFamily
    },
    htmlFontSize,
    variants,
    pxToRem,
    remToPx,
    setText
  };
};

export default createTypography;
