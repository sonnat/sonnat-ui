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
        : colors.createWhiteColor({ alpha: 0.5 }),
      disabled: !darkMode ? colors.pallete.grey[100] : colors.pallete.grey[900]
    },
    text: colors.getContrastColorOf(filledDefaultMainBg)
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
      }),
      disabled: changeColor(filledPrimaryMainBg, { alpha: 0.12 })
    },
    text: colors.getContrastColorOf(filledPrimaryMainBg)
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
      }),
      disabled: changeColor(filledSecondaryMainBg, { alpha: 0.12 })
    },
    text: colors.getContrastColorOf(filledSecondaryMainBg)
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
      main: changeColor(filledPrimaryMainBg, { alpha: 0.56 }),
      hover: filledPrimaryMainBg,
      active: filledPrimaryMainBg,
      disabled: changeColor(filledPrimaryMainBg, { alpha: 0.12 })
    },
    background: {
      hover: changeColor(filledPrimaryMainBg, { alpha: 0.04 }),
      active: changeColor(filledPrimaryMainBg, { alpha: 0.12 })
    },
    text: {
      main: filledPrimaryMainBg,
      hover: filledPrimaryMainBg,
      active: filledPrimaryMainBg,
      disabled: changeColor(filledPrimaryMainBg, { alpha: 0.32 })
    }
  };

  const outlinedSecondary = {
    border: {
      main: changeColor(filledSecondaryMainBg, { alpha: 0.56 }),
      hover: filledSecondaryMainBg,
      active: filledSecondaryMainBg,
      disabled: changeColor(filledSecondaryMainBg, { alpha: 0.12 })
    },
    background: {
      hover: changeColor(filledSecondaryMainBg, { alpha: 0.04 }),
      active: changeColor(filledSecondaryMainBg, { alpha: 0.12 })
    },
    text: {
      main: filledSecondaryMainBg,
      hover: filledSecondaryMainBg,
      active: filledSecondaryMainBg,
      disabled: changeColor(filledSecondaryMainBg, { alpha: 0.32 })
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
      hover: changeColor(filledPrimaryMainBg, { alpha: 0.04 }),
      active: changeColor(filledPrimaryMainBg, { alpha: 0.12 })
    },
    text: {
      main: filledPrimaryMainBg,
      hover: filledPrimaryMainBg,
      active: filledPrimaryMainBg,
      disabled: changeColor(filledPrimaryMainBg, { alpha: 0.32 })
    }
  };

  const inlinedSecondary = {
    background: {
      hover: changeColor(filledSecondaryMainBg, { alpha: 0.04 }),
      active: changeColor(filledSecondaryMainBg, { alpha: 0.12 })
    },
    text: {
      main: filledSecondaryMainBg,
      hover: filledSecondaryMainBg,
      active: filledSecondaryMainBg,
      disabled: changeColor(filledSecondaryMainBg, { alpha: 0.32 })
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
