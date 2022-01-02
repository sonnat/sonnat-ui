import { darken, lighten } from "../styles/colorUtils";
import type { DefaultTheme } from "../styles/defaultTheme";

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
    swatches: { grey }
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
        ? colors.createBlackColor({ alpha: 0.48 }, true)
        : colors.createWhiteColor({ alpha: 0.87 }, true),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.64 }, true)
        : colors.createWhiteColor({ alpha: 0.56 }, true),
      disabled: !darkMode ? grey[50] : grey[900]
    },
    text: colors.getContrastColorOf(filledDefaultMainBg)
  };

  const filledPrimary = {
    background: {
      main: filledPrimaryMainBg,
      hover: lighten(filledPrimaryMainBg, 0.15),
      active: darken(filledPrimaryMainBg, 0.15),
      disabled: colors.createPrimaryColor({ alpha: 0.12 }, true)
    },
    text: colors.getContrastColorOf(filledPrimaryMainBg)
  };

  const filledSecondary = {
    background: {
      main: filledSecondaryMainBg,
      hover: lighten(filledSecondaryMainBg, 0.15),
      active: darken(filledSecondaryMainBg, 0.15),
      disabled: colors.createSecondaryColor({ alpha: 0.12 }, true)
    },
    text: colors.getContrastColorOf(filledSecondaryMainBg)
  };

  const outlinedDefault = {
    border: {
      main: !darkMode
        ? colors.createBlackColor({ alpha: 0.48 }, true)
        : colors.createWhiteColor({ alpha: 0.48 }, true),
      hover: !darkMode
        ? colors.createBlackColor({ alpha: 0.64 }, true)
        : colors.createWhiteColor({ alpha: 0.64 }, true),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.64 }, true)
        : colors.createWhiteColor({ alpha: 0.64 }, true),
      disabled: colors.divider
    },
    background: {
      hover: !darkMode
        ? colors.createBlackColor({ alpha: 0.04 }, true)
        : colors.createWhiteColor({ alpha: 0.04 }, true),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.12 }, true)
        : colors.createWhiteColor({ alpha: 0.12 }, true)
    },
    text: {
      main: colors.text.secondary,
      hover: colors.text.secondary,
      active: colors.text.secondary,
      disabled: colors.text.disabled
    }
  };

  const outlinedPrimary = {
    border: {
      main: colors.createPrimaryColor({ alpha: 0.56 }, true),
      hover: filledPrimaryMainBg,
      active: filledPrimaryMainBg,
      disabled: colors.createPrimaryColor({ alpha: 0.12 }, true)
    },
    background: {
      hover: colors.createPrimaryColor({ alpha: 0.04 }, true),
      active: colors.createPrimaryColor({ alpha: 0.12 }, true)
    },
    text: {
      main: filledPrimaryMainBg,
      hover: filledPrimaryMainBg,
      active: filledPrimaryMainBg,
      disabled: colors.createPrimaryColor({ alpha: 0.32 }, true)
    }
  };

  const outlinedSecondary = {
    border: {
      main: colors.createSecondaryColor({ alpha: 0.56 }, true),
      hover: filledSecondaryMainBg,
      active: filledSecondaryMainBg,
      disabled: colors.createSecondaryColor({ alpha: 0.12 }, true)
    },
    background: {
      hover: colors.createSecondaryColor({ alpha: 0.04 }, true),
      active: colors.createSecondaryColor({ alpha: 0.12 }, true)
    },
    text: {
      main: filledSecondaryMainBg,
      hover: filledSecondaryMainBg,
      active: filledSecondaryMainBg,
      disabled: colors.createSecondaryColor({ alpha: 0.32 }, true)
    }
  };

  const inlinedDefault = {
    background: {
      hover: !darkMode
        ? colors.createBlackColor({ alpha: 0.04 }, true)
        : colors.createWhiteColor({ alpha: 0.04 }, true),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.12 }, true)
        : colors.createWhiteColor({ alpha: 0.12 }, true)
    },
    text: {
      main: colors.text.secondary,
      hover: colors.text.secondary,
      active: colors.text.secondary,
      disabled: colors.text.disabled
    }
  };

  const inlinedPrimary = {
    background: {
      hover: colors.createPrimaryColor({ alpha: 0.04 }, true),
      active: colors.createPrimaryColor({ alpha: 0.12 }, true)
    },
    text: {
      main: filledPrimaryMainBg,
      hover: filledPrimaryMainBg,
      active: filledPrimaryMainBg,
      disabled: colors.createPrimaryColor({ alpha: 0.32 }, true)
    }
  };

  const inlinedSecondary = {
    background: {
      hover: colors.createSecondaryColor({ alpha: 0.04 }, true),
      active: colors.createSecondaryColor({ alpha: 0.12 }, true)
    },
    text: {
      main: filledSecondaryMainBg,
      hover: filledSecondaryMainBg,
      active: filledSecondaryMainBg,
      disabled: colors.createSecondaryColor({ alpha: 0.32 }, true)
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
