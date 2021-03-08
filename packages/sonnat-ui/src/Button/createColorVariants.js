import { adjustColor, changeColor } from "../styles/colorUtils";

/**
 * @param {import("../styles").DefaultTheme} theme Theme object reference.
 *
 * @returns {import("./createColorVariants").ColorVariants} The color variants of the Button component.
 */
export default function createVariantColors(theme) {
  const { colors, darkMode } = theme;

  const filledDefaultMainBg = colors.text.secondary;
  const filledPrimaryMainBg = !darkMode
    ? colors.primary.origin
    : colors.primary.light;
  const filledSecondaryMainBg = !darkMode
    ? colors.secondary.origin
    : colors.secondary.light;

  const filledDefault = {
    background: {
      main: filledDefaultMainBg,
      hover: !darkMode
        ? adjustColor(filledDefaultMainBg, { lightness: 12 })
        : colors.createWhiteColor({ alpha: 0.98 }),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.6 })
        : colors.createWhiteColor({ alpha: 0.5 })
    },
    text: colors.getConstrastColorOf(filledDefaultMainBg)
  };

  const filledPrimary = {
    background: {
      main: filledPrimaryMainBg,
      hover: adjustColor(filledPrimaryMainBg, {
        saturation: -8,
        lightness: +8
      }),
      active: adjustColor(filledPrimaryMainBg, {
        saturation: +8,
        lightness: -4
      })
    },
    text: colors.getConstrastColorOf(filledPrimaryMainBg)
  };

  const filledSecondary = {
    background: {
      main: filledSecondaryMainBg,
      hover: adjustColor(filledSecondaryMainBg, {
        saturation: -8,
        lightness: +8
      }),
      active: adjustColor(filledSecondaryMainBg, {
        saturation: +8,
        lightness: -4
      })
    },
    text: colors.getConstrastColorOf(filledSecondaryMainBg)
  };

  const outlinedDefault = {
    border: {
      main: !darkMode
        ? colors.createBlackColor({ alpha: 0.48 })
        : colors.createWhiteColor({ alpha: 0.48 }),
      hover: !darkMode
        ? colors.createBlackColor({ alpha: 0.48 })
        : colors.createWhiteColor({ alpha: 0.48 }),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.48 })
        : colors.createWhiteColor({ alpha: 0.48 }),
      disabled: colors.divider
    },
    background: {
      hover: !darkMode
        ? colors.createBlackColor({ alpha: 0.04 })
        : colors.createWhiteColor({ alpha: 0.04 }),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.12 })
        : colors.createWhiteColor({ alpha: 0.12 })
    },
    text: {
      main: colors.text.secondary,
      hover: colors.text.primary,
      active: colors.text.primary,
      disabled: colors.text.disabled
    }
  };

  const outlinedPrimary = {
    border: {
      main: !darkMode
        ? colors.createPrimaryColor({ alpha: 0.56 })
        : changeColor(colors.primary.light, { alpha: 0.56 }),
      hover: !darkMode ? colors.primary.origin : colors.primary.light,
      active: !darkMode ? colors.primary.origin : colors.primary.light,
      disabled: !darkMode
        ? colors.createPrimaryColor({ alpha: 0.12 })
        : changeColor(colors.primary.light, { alpha: 0.12 })
    },
    background: {
      hover: !darkMode
        ? colors.createPrimaryColor({ alpha: 0.04 })
        : changeColor(colors.primary.light, { alpha: 0.04 }),
      active: !darkMode
        ? colors.createPrimaryColor({ alpha: 0.12 })
        : changeColor(colors.primary.light, { alpha: 0.12 })
    },
    text: {
      main: !darkMode ? colors.primary.origin : colors.primary.light,
      hover: !darkMode ? colors.primary.origin : colors.primary.light,
      active: !darkMode ? colors.primary.origin : colors.primary.light,
      disabled: !darkMode
        ? colors.createPrimaryColor({ alpha: 0.32 })
        : changeColor(colors.primary.light, { alpha: 0.32 })
    }
  };

  const outlinedSecondary = {
    border: {
      main: !darkMode
        ? colors.createSecondaryColor({ alpha: 0.56 })
        : changeColor(colors.secondary.light, { alpha: 0.56 }),
      hover: !darkMode ? colors.secondary.origin : colors.secondary.light,
      active: !darkMode ? colors.secondary.origin : colors.secondary.light,
      disabled: !darkMode
        ? colors.createSecondaryColor({ alpha: 0.12 })
        : changeColor(colors.secondary.light, { alpha: 0.12 })
    },
    background: {
      hover: !darkMode
        ? colors.createSecondaryColor({ alpha: 0.04 })
        : changeColor(colors.secondary.light, { alpha: 0.04 }),
      active: !darkMode
        ? colors.createSecondaryColor({ alpha: 0.12 })
        : changeColor(colors.secondary.light, { alpha: 0.12 })
    },
    text: {
      main: !darkMode ? colors.secondary.origin : colors.secondary.light,
      hover: !darkMode ? colors.secondary.origin : colors.secondary.light,
      active: !darkMode ? colors.secondary.origin : colors.secondary.light,
      disabled: !darkMode
        ? colors.createSecondaryColor({ alpha: 0.32 })
        : changeColor(colors.secondary.light, { alpha: 0.32 })
    }
  };

  const inlinedDefault = {
    background: {
      hover: !darkMode
        ? colors.createBlackColor({ alpha: 0.04 })
        : colors.createWhiteColor({ alpha: 0.04 }),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.12 })
        : colors.createWhiteColor({ alpha: 0.12 })
    },
    text: {
      main: colors.text.secondary,
      hover: colors.text.primary,
      active: colors.text.primary,
      disabled: colors.text.disabled
    }
  };

  const inlinedPrimary = {
    background: {
      hover: !darkMode
        ? colors.createPrimaryColor({ alpha: 0.04 })
        : changeColor(colors.primary.light, { alpha: 0.04 }),
      active: !darkMode
        ? colors.createPrimaryColor({ alpha: 0.12 })
        : changeColor(colors.primary.light, { alpha: 0.12 })
    },
    text: {
      main: !darkMode ? colors.primary.origin : colors.primary.light,
      hover: !darkMode ? colors.primary.origin : colors.primary.light,
      active: !darkMode ? colors.primary.origin : colors.primary.light,
      disabled: !darkMode
        ? colors.createPrimaryColor({ alpha: 0.32 })
        : changeColor(colors.primary.light, { alpha: 0.32 })
    }
  };

  const inlinedSecondary = {
    background: {
      hover: !darkMode
        ? colors.createSecondaryColor({ alpha: 0.04 })
        : changeColor(colors.secondary.light, { alpha: 0.04 }),
      active: !darkMode
        ? colors.createSecondaryColor({ alpha: 0.12 })
        : changeColor(colors.secondary.light, { alpha: 0.12 })
    },
    text: {
      main: !darkMode ? colors.secondary.origin : colors.secondary.light,
      hover: !darkMode ? colors.secondary.origin : colors.secondary.light,
      active: !darkMode ? colors.secondary.origin : colors.secondary.light,
      disabled: !darkMode
        ? colors.createSecondaryColor({ alpha: 0.32 })
        : changeColor(colors.secondary.light, { alpha: 0.32 })
    }
  };

  return {
    filledDefault,
    filledPrimary,
    filledSecondary,
    outlinedDefault,
    outlinedPrimary,
    outlinedSecondary,
    inlinedDefault,
    inlinedPrimary,
    inlinedSecondary
  };
}
