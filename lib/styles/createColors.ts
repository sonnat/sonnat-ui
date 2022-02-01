import Color from "color";
import {
  calculateContrastRatio,
  changeColorHsla,
  darken,
  lighten,
  opaquify as _opaquify,
  type ColorInputType,
  type HslaInputType
} from "./colorUtils";
import { blue, green, navy, orange, pink, red } from "./swatches";

export type BackgroundColorType = {
  origin: string;
  accents: { 1: string; 2: string };
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
  text: { light: TextColorType; dark: TextColorType };
  divider: { light: string; dark: string };
  background: { light: BackgroundColorType; dark: BackgroundColorType };
  white: string;
  black: string;
  createPrimaryColor: (
    hsla: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => string;
  createSecondaryColor: (
    hsla: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => string;
  createBlackColor: (
    hsla: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => string;
  createWhiteColor: (
    hsla: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => string;
  createErrorColor: (
    hsla: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => string;
  createWarningColor: (
    hsla: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => string;
  createSuccessColor: (
    hsla: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => string;
  createInfoColor: (
    hsla: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => string;
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

const contrastThreshold = 3;

const white = "#ffffff" as const;
const black = "#000000" as const;

const divider = {
  dark: "rgba(0, 0, 0, 0.12)",
  light: "rgba(255, 255, 255, 0.16)"
};

const background = {
  light: { origin: "#ffffff", accents: { 1: "#fafafa", 2: "#ebebeb" } },
  dark: { origin: "#121212", accents: { 1: "#292929", 2: "#1f1f1f" } }
};

const text = {
  light: {
    primary: white,
    secondary: _opaquify(
      changeColorHsla(white, { alpha: 0.64 }),
      background.dark.origin
    ),
    hint: _opaquify(
      changeColorHsla(white, { alpha: 0.32 }),
      background.dark.origin
    ),
    disabled: _opaquify(
      changeColorHsla(white, { alpha: 0.24 }),
      background.dark.origin
    )
  },
  dark: {
    primary: _opaquify(
      changeColorHsla(black, { alpha: 0.87 }),
      background.light.origin
    ),
    secondary: _opaquify(
      changeColorHsla(black, { alpha: 0.56 }),
      background.light.origin
    ),
    hint: _opaquify(
      changeColorHsla(black, { alpha: 0.32 }),
      background.light.origin
    ),
    disabled: _opaquify(
      changeColorHsla(black, { alpha: 0.24 }),
      background.light.origin
    )
  }
};

const defaultSystemColors = {
  primary: {
    light: pink[500],
    origin: pink[600],
    dark: pink[700]
  },
  secondary: {
    light: navy[400],
    origin: navy[600],
    dark: navy[700]
  },
  error: {
    light: red[500],
    origin: red[600],
    dark: red[700]
  },
  warning: {
    light: orange[500],
    origin: orange[600],
    dark: orange[700]
  },
  info: {
    light: blue[600],
    origin: blue[700],
    dark: blue[800]
  },
  success: {
    light: green[700],
    origin: green[800],
    dark: green[900]
  }
} as const;

const createLightVariant = (originColor: ColorInputType) =>
  lighten(originColor, 0.2);

const createDarkVariant = (originColor: ColorInputType) =>
  darken(originColor, 0.2);

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

const createColors = (colorsInput?: ColorsInput): Colors => {
  const {
    primary: primaryInput = defaultSystemColors.primary,
    secondary: secondaryInput = defaultSystemColors.secondary,
    error: errorInput = defaultSystemColors.error,
    warning: warningInput = defaultSystemColors.warning,
    info: infoInput = defaultSystemColors.info,
    success: successInput = defaultSystemColors.success,
    contrastThreshold: contrastThresholdInput = contrastThreshold
  } = colorsInput || {};

  const transparent = Color.rgb([255, 255, 255]).alpha(0).toString();

  const primary = completeSystemColor(primaryInput);
  const secondary = completeSystemColor(secondaryInput);
  const error = completeSystemColor(errorInput);
  const warning = completeSystemColor(warningInput);
  const info = completeSystemColor(infoInput);
  const success = completeSystemColor(successInput);

  const createBlackColor = (
    change: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => {
    const color = changeColorHsla(black, change);

    return opaquify
      ? _opaquify(
          color,
          darkMode ? background.dark.origin : background.light.origin
        )
      : color;
  };
  const createWhiteColor = (
    change: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => {
    const color = changeColorHsla(white, change);

    return opaquify
      ? _opaquify(
          color,
          darkMode ? background.dark.origin : background.light.origin
        )
      : color;
  };

  const createPrimaryColor = (
    change: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => {
    const color = changeColorHsla(
      !darkMode ? primary.origin : primary.light,
      change
    );

    return opaquify
      ? _opaquify(
          color,
          darkMode ? background.dark.origin : background.light.origin
        )
      : color;
  };

  const createSecondaryColor = (
    change: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => {
    const color = changeColorHsla(
      !darkMode ? secondary.origin : secondary.light,
      change
    );

    return opaquify
      ? _opaquify(
          color,
          darkMode ? background.dark.origin : background.light.origin
        )
      : color;
  };

  const createErrorColor = (
    change: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => {
    const color = changeColorHsla(
      !darkMode ? error.origin : error.light,
      change
    );

    return opaquify
      ? _opaquify(
          color,
          darkMode ? background.dark.origin : background.light.origin
        )
      : color;
  };

  const createSuccessColor = (
    change: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => {
    const color = changeColorHsla(
      !darkMode ? success.origin : success.light,
      change
    );

    return opaquify
      ? _opaquify(
          color,
          darkMode ? background.dark.origin : background.light.origin
        )
      : color;
  };

  const createWarningColor = (
    change: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => {
    const color = changeColorHsla(
      !darkMode ? warning.origin : warning.light,
      change
    );

    return opaquify
      ? _opaquify(
          color,
          darkMode ? background.dark.origin : background.light.origin
        )
      : color;
  };

  const createInfoColor = (
    change: HslaInputType,
    opaquify: boolean,
    darkMode: boolean
  ) => {
    const color = changeColorHsla(!darkMode ? info.origin : info.light, change);

    return opaquify
      ? _opaquify(
          color,
          darkMode ? background.dark.origin : background.light.origin
        )
      : color;
  };

  const getContrastColorOf = (background: ColorInputType) => {
    const contrastForeground =
      calculateContrastRatio(background, text.light.primary) >=
      contrastThresholdInput
        ? text.light.primary
        : text.dark.primary;

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
    text,
    divider,
    background,
    contrastThreshold: contrastThresholdInput,
    createErrorColor,
    createSuccessColor,
    createWarningColor,
    createInfoColor,
    createPrimaryColor,
    createBlackColor,
    createSecondaryColor,
    createWhiteColor,
    getContrastColorOf
  };
};

export default createColors;
