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
      lineHeight = 2,
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
    h1: {
      rules: buildVariant(sonnatFontWeight.medium, 48, 1.5),
      responsiveRules: { fontSize: pxToRem(32) }
    },
    h2: {
      rules: buildVariant(sonnatFontWeight.medium, 32, 1.5)
    },
    h3: {
      rules: buildVariant(sonnatFontWeight.medium, 24, 1.5),
      responsiveRules: { fontSize: pxToRem(20) }
    },
    h4: {
      rules: buildVariant(sonnatFontWeight.medium, 20, 1.5),
      responsiveRules: { fontSize: pxToRem(18) }
    },
    h5: { rules: buildVariant(sonnatFontWeight.medium, 18, 1.5) },
    h6: { rules: buildVariant(sonnatFontWeight.medium, 16, 1.5) },
    heroText: {
      large: {
        bolder: {
          rules: buildVariant(sonnatFontWeight.bold, 48, 1.5),
          responsiveRules: { fontSize: pxToRem(32) }
        },
        lighter: {
          rules: buildVariant(sonnatFontWeight.light, 48, 1.5),
          responsiveRules: {
            fontSize: pxToRem(32),
            fontWeight: sonnatFontWeight.regular
          }
        },
        rules: buildVariant(sonnatFontWeight.medium, 48, 1.5),
        responsiveRules: { fontSize: pxToRem(32) }
      },
      medium: {
        bolder: {
          rules: buildVariant(sonnatFontWeight.bold, 40, 1.5),
          responsiveRules: {
            fontSize: pxToRem(32),
            fontWeight: sonnatFontWeight.medium
          }
        },
        lighter: {
          rules: buildVariant(sonnatFontWeight.light, 40, 1.5),
          responsiveRules: {
            fontSize: pxToRem(32),
            fontWeight: sonnatFontWeight.regular
          }
        },
        rules: buildVariant(sonnatFontWeight.medium, 40, 1.5),
        responsiveRules: { fontSize: pxToRem(32) }
      },
      small: {
        bolder: {
          rules: buildVariant(sonnatFontWeight.bold, 32, 1.5),
          responsiveRules: { fontSize: pxToRem(24) }
        },
        lighter: {
          rules: buildVariant(sonnatFontWeight.regular, 32, 1.5),
          responsiveRules: {
            fontSize: pxToRem(24),
            fontWeight: sonnatFontWeight.medium
          }
        },
        rules: buildVariant(sonnatFontWeight.medium, 32, 1.5),
        responsiveRules: { fontSize: pxToRem(24) }
      }
    },
    titleText: {
      large: {
        rules: buildVariant(sonnatFontWeight.medium, 24, 1.5),
        responsiveRules: { fontSize: pxToRem(20) }
      },
      medium: {
        rules: buildVariant(sonnatFontWeight.medium, 20, 1.5),
        responsiveRules: { fontSize: pxToRem(18) }
      },
      small: {
        rules: buildVariant(sonnatFontWeight.medium, 18, 1.5)
      },
      extraSmall: {
        rules: buildVariant(sonnatFontWeight.medium, 16, 1.5)
      }
    },
    bodyText: {
      large: {
        lighter: {
          rules: buildVariant(sonnatFontWeight.light, 18, 2),
          responsiveRules: { fontSize: pxToRem(16) }
        },
        rules: buildVariant(sonnatFontWeight.regular, 18, 2),
        responsiveRules: { fontSize: pxToRem(16) }
      },
      medium: {
        bolder: {
          rules: buildVariant(sonnatFontWeight.medium, 16, 2),
          responsiveRules: { fontSize: pxToRem(14) }
        },
        rules: buildVariant(sonnatFontWeight.regular, 16, 2),
        responsiveRules: { fontSize: pxToRem(14) }
      },
      small: {
        bolder: { rules: buildVariant(sonnatFontWeight.medium, 14, 2) },
        rules: buildVariant(sonnatFontWeight.regular, 14, 2)
      }
    },
    captionText: {
      large: {
        bolder: { rules: buildVariant(sonnatFontWeight.medium, 12, 2) },
        rules: buildVariant(sonnatFontWeight.regular, 12, 2)
      },
      medium: {
        bolder: { rules: buildVariant(sonnatFontWeight.medium, 10, 2) },
        rules: buildVariant(sonnatFontWeight.regular, 10, 2)
      },
      small: {
        rules: buildVariant(sonnatFontWeight.regular, 8, 2)
      }
    }
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
