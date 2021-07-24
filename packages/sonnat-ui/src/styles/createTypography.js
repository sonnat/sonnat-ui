export const sonnatRtlFontFamily = `IRANSans, Arial, Tahoma, Helvetica`;

export const sonnatLtrFontFamily = `"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI",
"Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
"Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;

export const sonnatMonospaceFontFamily = `"Roboto Mono", "SFMono-Regular", "Menlo", "Monaco",
"Consolas", "Liberation Mono", "Courier New", "monospace"`;

export const sonnatFontSize = 16;
export const sonnatFontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700
};

export default function createTypography(typography) {
  const {
    // The default font size of the Sonnat Specification.
    fontSize: systemFontSize = sonnatFontSize,
    htmlFontSize = 16,
    ltrFontFamily = sonnatLtrFontFamily,
    rtlFontFamily = sonnatRtlFontFamily,
    monospaceFontFamily = sonnatMonospaceFontFamily
  } = typography;

  if (process.env.NODE_ENV !== "production") {
    if (typeof systemFontSize !== "number") {
      // eslint-disable-next-line no-console
      console.error("Sonnat: `fontSize` is required to be a number.");
    }

    if (typeof htmlFontSize !== "number") {
      // eslint-disable-next-line no-console
      console.error("Sonnat: `htmlFontSize` is required to be a number.");
    }
  }

  const coef = systemFontSize / sonnatFontSize;
  const pxToRem = size =>
    typeof size === "number" && !isNaN(size)
      ? `${(size / htmlFontSize) * coef}rem`
      : "";
  const remToPx = size =>
    typeof size === "number" && !isNaN(size)
      ? `${(size * htmlFontSize) / coef}px`
      : "";

  const useText = (textProperties = {}) => {
    const {
      fontSize = pxToRem(systemFontSize),
      fontWeight = sonnatFontWeight.regular,
      lineHeight = 1.625,
      color
    } = textProperties;

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
      textSizeAdjust: "100%"
    };
  };

  const buildVariant = (fontSize, lineHeight, fontWeight) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useText({ fontSize: pxToRem(fontSize), fontWeight, lineHeight });

  const variants = {
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
    fontFamily: {
      ltr: ltrFontFamily,
      rtl: rtlFontFamily,
      monospace: monospaceFontFamily
    },
    fontSize: systemFontSize,
    pxToRem,
    remToPx,
    htmlFontSize,
    useText,
    variants
  };
}
