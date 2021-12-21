import Color from "color";
import {
  calculateContrastRatio,
  changeColorHsla,
  ColorInputType,
  darken,
  HslaInputType,
  lighten
} from "./colorUtils";
import {
  blue,
  deepOrange,
  grey,
  lightBlue,
  lightGreen,
  pink,
  red
} from "./palette";

export type BackgroundColorType = {
  origin: string;
  level: { 1: string; 2: string };
};

export type TextColorType = {
  primary: string;
  secondary: string;
  disabled: string;
  hint: string;
};

export type ColorVariant = {
  origin: string;
  light: string;
  dark: string;
};

export interface Colors {
  primary: ColorVariant;
  secondary: ColorVariant;
  error: ColorVariant;
  warning: ColorVariant;
  info: ColorVariant;
  success: ColorVariant;
  transparent: string;
  contrastThreshold: number;
  text: TextColorType;
  divider: string;
  white: string;
  black: string;
  background: BackgroundColorType;
  createPrimaryColor: (hsla: HslaInputType) => string;
  createSecondaryColor: (hsla: HslaInputType) => string;
  createBlackColor: (hsla: HslaInputType) => string;
  createWhiteColor: (hsla: HslaInputType) => string;
  getContrastColorOf: (background: ColorInputType) => string;
}

export interface ColorsInput {
  primary?: Colors["primary"] | string;
  secondary?: Colors["secondary"] | string;
  error?: Colors["error"] | string;
  warning?: Colors["warning"] | string;
  info?: Colors["info"] | string;
  success?: Colors["success"] | string;
  contrastThreshold?: number;
}

const contrastThreshold = 3 as const;

const white = "#ffffff" as const;
const black = "#000000" as const;

export const dark = {
  text: {
    primary: "#ffffff",
    secondary: "rgba(255, 255, 255, 0.7)",
    disabled: "rgba(255, 255, 255, 0.12)",
    hint: "rgba(255, 255, 255, 0.32)"
  },
  divider: "rgba(255, 255, 255, 0.12)",
  background: {
    origin: "#121212",
    level: {
      1: "#242424",
      2: "#1B1B1B"
    }
  }
} as const;

export const light = {
  text: {
    primary: "rgba(0, 0, 0, 0.87)",
    secondary: "rgba(0, 0, 0, 0.56)",
    disabled: "rgba(0, 0, 0, 0.32)",
    hint: "rgba(0, 0, 0, 0.32)"
  },
  divider: "rgba(0, 0, 0, 0.12)",
  background: {
    origin: "#ffffff",
    level: {
      1: grey[50],
      2: grey[100]
    }
  }
} as const;

const defaultSystemColors = {
  primary: {
    light: pink[300],
    origin: pink[500],
    dark: pink[700]
  },
  secondary: {
    light: blue[300],
    origin: blue[500],
    dark: blue[700]
  },
  error: {
    light: red[500],
    origin: red[700],
    dark: red[900]
  },
  warning: {
    light: deepOrange[300],
    origin: deepOrange[500],
    dark: deepOrange[700]
  },
  info: {
    light: lightBlue[300],
    origin: lightBlue[500],
    dark: lightBlue[700]
  },
  success: {
    light: lightGreen[500],
    origin: lightGreen[700],
    dark: lightGreen[900]
  }
} as const;

const createLightVariant = (originColor: ColorInputType) => {
  return lighten(originColor, 0.2);
};

const createDarkVariant = (originColor: ColorInputType) => {
  return darken(originColor, 0.2);
};

const completeSystemColor = (variantInput: string | ColorVariant) => {
  const pairing: ColorVariant = { origin: "", light: "", dark: "" };

  if (typeof variantInput === "string") {
    pairing.origin = variantInput;
    pairing.light = createLightVariant(variantInput);
    pairing.dark = createDarkVariant(variantInput);
  } else if (typeof variantInput === "object") {
    const { origin, light, dark } = variantInput;

    if (!origin || !light || !dark) {
      throw new Error(
        "`color.origin` should be provided along with `color.light` and `color.dark`."
      );
    }

    if (typeof origin !== "string") {
      throw new Error("`color.origin` should be a string!");
    }

    if (typeof light !== "string") {
      throw new Error("`color.light` should be a string!");
    }

    if (typeof dark !== "string") {
      throw new Error("`color.dark` should be a string!");
    }

    pairing.origin = origin;
    pairing.light = light;
    pairing.dark = dark;
  } else {
    throw new Error(
      [
        "[Sonnat]: The color object passed to the `theme` is invalid!",
        "The colors can either be a `string` (representing the origin) or an `object` with `origin`, `light` and `dark` properties."
      ].join("\n")
    );
  }

  return pairing;
};

const createColors = (
  colorsInput?: ColorsInput,
  isDarkMode?: boolean
): Colors => {
  const {
    primary: primaryInput = defaultSystemColors.primary,
    secondary: secondaryInput = defaultSystemColors.secondary,
    error: errorInput = defaultSystemColors.error,
    warning: warningInput = defaultSystemColors.warning,
    info: infoInput = defaultSystemColors.info,
    success: successInput = defaultSystemColors.success,
    contrastThreshold: contrastThresholdInput = contrastThreshold
  } = colorsInput || {};

  const isDark = isDarkMode;

  const transparent = Color.rgb([255, 255, 255]).alpha(0).toString();

  const primary = completeSystemColor(primaryInput);
  const secondary = completeSystemColor(secondaryInput);
  const error = completeSystemColor(errorInput);
  const warning = completeSystemColor(warningInput);
  const info = completeSystemColor(infoInput);
  const success = completeSystemColor(successInput);

  const createBlackColor = (change: HslaInputType) =>
    changeColorHsla(black, change);
  const createWhiteColor = (change: HslaInputType) =>
    changeColorHsla(white, change);
  const createPrimaryColor = (change: HslaInputType) =>
    changeColorHsla(primary.origin, change);
  const createSecondaryColor = (change: HslaInputType) =>
    changeColorHsla(secondary.origin, change);

  const getContrastColorOf = (background: ColorInputType) => {
    const contrastForeground =
      calculateContrastRatio(background, dark.text.primary) >=
      contrastThresholdInput
        ? dark.text.primary
        : light.text.primary;

    if (process.env.NODE_ENV !== "production") {
      const contrast = calculateContrastRatio(background, contrastForeground);

      if (contrast < 3) {
        // eslint-disable-next-line no-console
        console.error(
          [
            `Sonnat: The contrast ratio of ${contrast}:1 for ${contrastForeground} on ${
              background as string
            }`,
            "falls below the WCAG recommended absolute minimum contrast ratio of 3:1.",
            "https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast"
          ].join("\n")
        );
      }
    }

    return contrastForeground;
  };

  return {
    primary,
    secondary,
    error,
    warning,
    info,
    success,
    transparent,
    white,
    black,
    contrastThreshold: contrastThresholdInput,
    createPrimaryColor,
    createBlackColor,
    createSecondaryColor,
    createWhiteColor,
    getContrastColorOf,
    ...(isDark ? dark : light)
  };
};

export default createColors;
