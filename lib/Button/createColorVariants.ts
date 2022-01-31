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
    darkMode,
    colors: { text, divider, ...colors }
  } = theme;

  const filledDefaultMainBg = !darkMode
    ? text.dark.secondary
    : text.light.secondary;
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
        ? colors.createBlackColor({ alpha: 0.48 }, true, darkMode)
        : colors.createWhiteColor({ alpha: 0.87 }, true, darkMode),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.64 }, true, darkMode)
        : colors.createWhiteColor({ alpha: 0.56 }, true, darkMode),
      disabled: !darkMode
        ? colors.createBlackColor({ alpha: 0.12 }, true, darkMode)
        : colors.createWhiteColor({ alpha: 0.12 }, true, darkMode)
    },
    text: colors.getContrastColorOf(filledDefaultMainBg)
  };

  const filledPrimary = {
    background: {
      main: filledPrimaryMainBg,
      hover: lighten(filledPrimaryMainBg, 0.15),
      active: darken(filledPrimaryMainBg, 0.15),
      disabled: colors.createPrimaryColor({ alpha: 0.12 }, true, darkMode)
    },
    text: colors.getContrastColorOf(filledPrimaryMainBg)
  };

  const filledSecondary = {
    background: {
      main: filledSecondaryMainBg,
      hover: lighten(filledSecondaryMainBg, 0.15),
      active: darken(filledSecondaryMainBg, 0.15),
      disabled: colors.createSecondaryColor({ alpha: 0.12 }, true, darkMode)
    },
    text: colors.getContrastColorOf(filledSecondaryMainBg)
  };

  const outlinedDefault = {
    border: {
      main: !darkMode
        ? colors.createBlackColor({ alpha: 0.48 }, true, darkMode)
        : colors.createWhiteColor({ alpha: 0.48 }, true, darkMode),
      hover: !darkMode
        ? colors.createBlackColor({ alpha: 0.64 }, true, darkMode)
        : colors.createWhiteColor({ alpha: 0.64 }, true, darkMode),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.64 }, true, darkMode)
        : colors.createWhiteColor({ alpha: 0.64 }, true, darkMode),
      disabled: !darkMode ? divider.dark : divider.light
    },
    background: {
      hover: !darkMode
        ? colors.createBlackColor({ alpha: 0.04 }, false, darkMode)
        : colors.createWhiteColor({ alpha: 0.04 }, false, darkMode),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
        : colors.createWhiteColor({ alpha: 0.12 }, false, darkMode)
    },
    text: {
      main: !darkMode ? text.dark.secondary : text.light.secondary,
      hover: !darkMode ? text.dark.secondary : text.light.secondary,
      active: !darkMode ? text.dark.secondary : text.light.secondary,
      disabled: !darkMode ? text.dark.disabled : text.light.disabled
    }
  };

  const outlinedPrimary = {
    border: {
      main: colors.createPrimaryColor({ alpha: 0.56 }, true, darkMode),
      hover: filledPrimaryMainBg,
      active: filledPrimaryMainBg,
      disabled: colors.createPrimaryColor({ alpha: 0.12 }, true, darkMode)
    },
    background: {
      hover: colors.createPrimaryColor({ alpha: 0.04 }, false, darkMode),
      active: colors.createPrimaryColor({ alpha: 0.12 }, false, darkMode)
    },
    text: {
      main: filledPrimaryMainBg,
      hover: filledPrimaryMainBg,
      active: filledPrimaryMainBg,
      disabled: colors.createPrimaryColor({ alpha: 0.32 }, true, darkMode)
    }
  };

  const outlinedSecondary = {
    border: {
      main: colors.createSecondaryColor({ alpha: 0.56 }, true, darkMode),
      hover: filledSecondaryMainBg,
      active: filledSecondaryMainBg,
      disabled: colors.createSecondaryColor({ alpha: 0.12 }, true, darkMode)
    },
    background: {
      hover: colors.createSecondaryColor({ alpha: 0.04 }, false, darkMode),
      active: colors.createSecondaryColor({ alpha: 0.12 }, false, darkMode)
    },
    text: {
      main: filledSecondaryMainBg,
      hover: filledSecondaryMainBg,
      active: filledSecondaryMainBg,
      disabled: colors.createSecondaryColor({ alpha: 0.32 }, true, darkMode)
    }
  };

  const inlinedDefault = {
    background: {
      hover: !darkMode
        ? colors.createBlackColor({ alpha: 0.04 }, false, darkMode)
        : colors.createWhiteColor({ alpha: 0.04 }, false, darkMode),
      active: !darkMode
        ? colors.createBlackColor({ alpha: 0.12 }, false, darkMode)
        : colors.createWhiteColor({ alpha: 0.12 }, false, darkMode)
    },
    text: {
      main: !darkMode ? text.dark.secondary : text.light.secondary,
      hover: !darkMode ? text.dark.secondary : text.light.secondary,
      active: !darkMode ? text.dark.secondary : text.light.secondary,
      disabled: !darkMode ? text.dark.disabled : text.light.disabled
    }
  };

  const inlinedPrimary = {
    background: {
      hover: colors.createPrimaryColor({ alpha: 0.04 }, false, darkMode),
      active: colors.createPrimaryColor({ alpha: 0.12 }, false, darkMode)
    },
    text: {
      main: filledPrimaryMainBg,
      hover: filledPrimaryMainBg,
      active: filledPrimaryMainBg,
      disabled: colors.createPrimaryColor({ alpha: 0.32 }, true, darkMode)
    }
  };

  const inlinedSecondary = {
    background: {
      hover: colors.createSecondaryColor({ alpha: 0.04 }, false, darkMode),
      active: colors.createSecondaryColor({ alpha: 0.12 }, false, darkMode)
    },
    text: {
      main: filledSecondaryMainBg,
      hover: filledSecondaryMainBg,
      active: filledSecondaryMainBg,
      disabled: colors.createSecondaryColor({ alpha: 0.32 }, true, darkMode)
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
