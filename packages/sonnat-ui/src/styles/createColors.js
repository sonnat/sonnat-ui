import Color from "color";
import deepMerge from "../utils/deepMerge";
import pallete from "./pallete";
import {
  calculateContrastRatio,
  changeColor,
  lighten,
  darken
} from "./colorUtils";

const contrastThreshold = 3;

const white = "#ffffff";
const black = "#000000";

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
};

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
      1: pallete.grey[50],
      2: pallete.grey[100]
    }
  }
};

export const getConstrastColorOf = background => {
  const contrastForeground =
    calculateContrastRatio(background, dark.text.primary) >= contrastThreshold
      ? dark.text.primary
      : light.text.primary;

  if (process.env.NODE_ENV !== "production") {
    const contrast = calculateContrastRatio(background, contrastForeground);

    if (contrast < 3) {
      // eslint-disable-next-line no-console
      console.error(
        [
          `Sonnat: The contrast ratio of ${contrast}:1 for ${contrastForeground} on ${background}`,
          "falls below the WCAG recommended absolute minimum contrast ratio of 3:1.",
          "https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast"
        ].join("\n")
      );
    }
  }

  return contrastForeground;
};

const defaultSystemColors = {
  primary: {
    light: pallete.pink[300],
    origin: pallete.pink[500],
    dark: pallete.pink[700]
  },
  secondary: {
    light: pallete.blue[300],
    origin: pallete.blue[500],
    dark: pallete.blue[700]
  },
  error: {
    light: pallete.red[500],
    origin: pallete.red[700],
    dark: pallete.red[900]
  },
  warning: {
    light: pallete.deepOrange[300],
    origin: pallete.deepOrange[500],
    dark: pallete.deepOrange[700]
  },
  info: {
    light: pallete.lightBlue[300],
    origin: pallete.lightBlue[500],
    dark: pallete.lightBlue[700]
  },
  success: {
    light: pallete.lightGreen[500],
    origin: pallete.lightGreen[700],
    dark: pallete.lightGreen[900]
  }
};

const createLightVariant = originColor => {
  return lighten(originColor, 0.2);
};

const createDarkVariant = originColor => {
  return darken(originColor, 0.2);
};

const completeSystemColor = variantInput => {
  const pairing = { origin: "", light: "", dark: "" };

  if (typeof variantInput === "string") {
    pairing.origin = variantInput;
    pairing.light = createLightVariant(variantInput);
    pairing.dark = createDarkVariant(variantInput);
  } else if (typeof variantInput === "object") {
    const { origin, light, dark } = variantInput;

    if (
      (origin && dark && !light) ||
      (origin && light && !dark) ||
      (!origin && dark) ||
      (!origin && light)
    ) {
      throw new Error(
        "`color.origin` should be provided along with `color.light` and `color.dark`!"
      );
    }

    if (typeof origin !== "string") {
      throw new Error("`color.origin` should be a string!");
    }

    if (light && typeof light !== "string") {
      throw new Error("`color.light` should be a string!");
    }

    if (dark && typeof dark !== "string") {
      throw new Error("`color.dark` should be a string!");
    }

    pairing.origin = origin;

    if (!light) {
      pairing.light = createLightVariant(origin);
    } else pairing.light = light;

    if (!dark) {
      pairing.dark = createDarkVariant(origin);
    } else pairing.dark = dark;
  } else {
    throw new Error(
      [
        "[Sonnat]: The color format provided to `theme` is invalid!",
        "The colors can either be a `string` (representing the origin) or an `object` with `origin`, `light` and `dark` properties."
      ].join("\n")
    );
  }

  return pairing;
};

export default (colors, themeMode = "light") => {
  const {
    primary: primaryInput = defaultSystemColors.primary,
    secondary: secondaryInput = defaultSystemColors.secondary,
    error: errorInput = defaultSystemColors.error,
    warning: warningInput = defaultSystemColors.warning,
    info: infoInput = defaultSystemColors.info,
    success: successInput = defaultSystemColors.success,
    ...otherColors
  } = colors;

  const isDark = themeMode === "dark";

  const transparent = Color.rgb([255, 255, 255]).alpha(0).toString();

  const primary = completeSystemColor(primaryInput);
  const secondary = completeSystemColor(secondaryInput);
  const error = completeSystemColor(errorInput);
  const warning = completeSystemColor(warningInput);
  const info = completeSystemColor(infoInput);
  const success = completeSystemColor(successInput);

  const createBlackColor = change => changeColor(black, change);
  const createWhiteColor = change => changeColor(white, change);
  const createPrimaryColor = change => changeColor(primary.origin, change);
  const createSecondaryColor = change => changeColor(secondary.origin, change);

  return {
    ...deepMerge(
      {
        primary,
        secondary,
        error,
        warning,
        info,
        success,
        transparent,
        createPrimaryColor,
        createBlackColor,
        createSecondaryColor,
        createWhiteColor,
        contrastThreshold,
        getConstrastColorOf,
        ...(isDark ? dark : light)
      },
      otherColors
    ),
    pallete,
    white,
    black
  };
};
