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
    fontSize = sonnatFontSize,
    htmlFontSize = 16,
    ltrFontFamily = sonnatLtrFontFamily,
    rtlFontFamily = sonnatRtlFontFamily,
    monospaceFontFamily = sonnatMonospaceFontFamily
  } = typography;

  if (process.env.NODE_ENV !== "production") {
    if (typeof fontSize !== "number") {
      // eslint-disable-next-line no-console
      console.error("Sonnat: `fontSize` is required to be a number.");
    }

    if (typeof htmlFontSize !== "number") {
      // eslint-disable-next-line no-console
      console.error("Sonnat: `htmlFontSize` is required to be a number.");
    }
  }

  const coef = fontSize / sonnatFontSize;
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
      fontSize = pxToRem(16),
      fontWeight = sonnatFontWeight.regular,
      lineHeight = 1.5,
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

  const buildVariant = (fontWeight, fontSize, lineHeight) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useText({ fontSize: pxToRem(fontSize), fontWeight, lineHeight });

  const variants = {
    h1: buildVariant(sonnatFontWeight.medium, 56, 1.1428571429),
    h2: buildVariant(sonnatFontWeight.medium, 48, 1.1666666667),
    h3: buildVariant(sonnatFontWeight.medium, 32, 1.25),
    h4: buildVariant(sonnatFontWeight.medium, 24, 1.3333333333),
    h5: buildVariant(sonnatFontWeight.medium, 20, 1.4),
    h6: buildVariant(sonnatFontWeight.medium, 18, 1.4444444444),
    subtitle: buildVariant(sonnatFontWeight.medium, 16, 1.5),
    subtitleSmall: buildVariant(sonnatFontWeight.medium, 14, 1.5714285714),
    body: buildVariant(sonnatFontWeight.regular, 16, 1.5),
    bodySmall: buildVariant(sonnatFontWeight.regular, 14, 1.5714285714),
    caption: buildVariant(sonnatFontWeight.regular, 12, 1.6666666667),
    captionSmall: buildVariant(sonnatFontWeight.regular, 10, 1.8)
  };

  return {
    fontWeight: sonnatFontWeight,
    fontFamily: {
      ltr: ltrFontFamily,
      rtl: rtlFontFamily,
      monospace: monospaceFontFamily
    },
    pxToRem,
    remToPx,
    fontSize,
    htmlFontSize,
    useText,
    variants
  };
}
