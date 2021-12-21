import type { DefaultTheme } from "../styles/defaultTheme";
import { adjustColorHsla, changeColorHsla } from "../styles/colorUtils";

interface BorderColorVariants {
  main: string;
  hover: string;
  active: string;
  disabled: string;
}

interface BackgroundColorVariants {
  main: string;
  hover: string;
  active: string;
  disabled: string;
}

interface TextColorVariants {
  main: string;
  hover: string;
  active: string;
  disabled: string;
}

interface FilledButton {
  background: Partial<
    Pick<BackgroundColorVariants, "main" | "hover" | "active" | "disabled">
  >;
  text: string;
}

interface OutlinedButton {
  border: BorderColorVariants;
  background: Pick<BackgroundColorVariants, "hover" | "active">;
  text: TextColorVariants;
}

interface InlinedButton {
  background: Pick<BackgroundColorVariants, "hover" | "active">;
  text: TextColorVariants;
}

interface ColorVariants {
  filledDefault: FilledButton;
  filledPrimary: FilledButton;
  filledSecondary: FilledButton;
  outlinedDefault: OutlinedButton;
  outlinedPrimary: OutlinedButton;
  outlinedSecondary: OutlinedButton;
  inlinedDefault: InlinedButton;
  inlinedPrimary: InlinedButton;
  inlinedSecondary: InlinedButton;
}

const createVariantColors = (theme: DefaultTheme): ColorVariants => {
  const {
    colors,
    darkMode,
    palette: { grey }
  } = theme;

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
        ? adjustColorHsla(filledDefaultMainBg, { lightness: 12 })
        : colors.createWhiteColor({ alpha: 0.98 }),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.6 })
        : colors.createWhiteColor({ alpha: 0.5 }),
      disabled: !darkMode ? grey[100] : grey[900]
    },
    text: colors.getContrastColorOf(filledDefaultMainBg)
  };

  const filledPrimary = {
    background: {
      main: filledPrimaryMainBg,
      hover: adjustColorHsla(filledPrimaryMainBg, {
        saturation: -8,
        lightness: +8
      }),
      active: adjustColorHsla(filledPrimaryMainBg, {
        saturation: +8,
        lightness: -4
      }),
      disabled: changeColorHsla(filledPrimaryMainBg, { alpha: 0.12 })
    },
    text: colors.getContrastColorOf(filledPrimaryMainBg)
  };

  const filledSecondary = {
    background: {
      main: filledSecondaryMainBg,
      hover: adjustColorHsla(filledSecondaryMainBg, {
        saturation: -8,
        lightness: +8
      }),
      active: adjustColorHsla(filledSecondaryMainBg, {
        saturation: +8,
        lightness: -4
      }),
      disabled: changeColorHsla(filledSecondaryMainBg, { alpha: 0.12 })
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
      main: changeColorHsla(filledPrimaryMainBg, { alpha: 0.56 }),
      hover: filledPrimaryMainBg,
      active: filledPrimaryMainBg,
      disabled: changeColorHsla(filledPrimaryMainBg, { alpha: 0.12 })
    },
    background: {
      hover: changeColorHsla(filledPrimaryMainBg, { alpha: 0.04 }),
      active: changeColorHsla(filledPrimaryMainBg, { alpha: 0.12 })
    },
    text: {
      main: filledPrimaryMainBg,
      hover: filledPrimaryMainBg,
      active: filledPrimaryMainBg,
      disabled: changeColorHsla(filledPrimaryMainBg, { alpha: 0.32 })
    }
  };

  const outlinedSecondary = {
    border: {
      main: changeColorHsla(filledSecondaryMainBg, { alpha: 0.56 }),
      hover: filledSecondaryMainBg,
      active: filledSecondaryMainBg,
      disabled: changeColorHsla(filledSecondaryMainBg, { alpha: 0.12 })
    },
    background: {
      hover: changeColorHsla(filledSecondaryMainBg, { alpha: 0.04 }),
      active: changeColorHsla(filledSecondaryMainBg, { alpha: 0.12 })
    },
    text: {
      main: filledSecondaryMainBg,
      hover: filledSecondaryMainBg,
      active: filledSecondaryMainBg,
      disabled: changeColorHsla(filledSecondaryMainBg, { alpha: 0.32 })
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
      hover: changeColorHsla(filledPrimaryMainBg, { alpha: 0.04 }),
      active: changeColorHsla(filledPrimaryMainBg, { alpha: 0.12 })
    },
    text: {
      main: filledPrimaryMainBg,
      hover: filledPrimaryMainBg,
      active: filledPrimaryMainBg,
      disabled: changeColorHsla(filledPrimaryMainBg, { alpha: 0.32 })
    }
  };

  const inlinedSecondary = {
    background: {
      hover: changeColorHsla(filledSecondaryMainBg, { alpha: 0.04 }),
      active: changeColorHsla(filledSecondaryMainBg, { alpha: 0.12 })
    },
    text: {
      main: filledSecondaryMainBg,
      hover: filledSecondaryMainBg,
      active: filledSecondaryMainBg,
      disabled: changeColorHsla(filledSecondaryMainBg, { alpha: 0.32 })
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
};

export default createVariantColors;
