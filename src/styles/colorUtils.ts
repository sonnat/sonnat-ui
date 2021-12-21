import Color from "color";

export type ColorInputType = string | Color;

export type ColorSet = Record<
  50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  string
>;

export interface HslaInputType {
  hue?: number;
  saturation?: number;
  lightness?: number;
  alpha?: number;
}

export const toRgb = (color: ColorInputType): string =>
  new Color(color).rgb().toString();

export const toHex = (color: ColorInputType): string =>
  new Color(color).hex().toString();

export const toHsl = (color: ColorInputType): string =>
  new Color(color).hsl().toString();

/**
 * Calculates the relative brightness of any point in a color space.
 */
export const getLuminance = (color: ColorInputType): number =>
  new Color(color).luminosity();

/**
 * Calculates the contrast ratio between two colors.
 *
 * A contrast ratio value in the range 1 (same color) to 21 (contrast b/w white and black).
 */
export const calculateContrastRatio = (
  foreground: ColorInputType,
  background: ColorInputType
): number => new Color(foreground).contrast(new Color(background));

export const darken = (color: ColorInputType, tonalOffset: number): string =>
  toRgb(new Color(color).darken(tonalOffset));

export const lighten = (color: ColorInputType, tonalOffset: number): string =>
  toRgb(new Color(color).lighten(tonalOffset));

/**
 * Darken or lighten a color, depending on its luminance.
 * Light colors are darkened, dark colors are lightened.
 */
export const emphasize = (color: ColorInputType, tonalOffset = 0.15): string =>
  getLuminance(color) > 0.5
    ? darken(color, tonalOffset)
    : lighten(color, tonalOffset);

export const adjustColorHsla = (
  color: ColorInputType,
  adjustment: HslaInputType
): string => {
  const _color = new Color(color);
  const { hue = 0, saturation = 0, lightness = 0, alpha = 0 } = adjustment;

  return toRgb(
    new Color(color)
      .hue(_color.hue() + hue)
      .saturationl(_color.saturationl() + saturation)
      .lightness(_color.lightness() + lightness)
      .alpha(_color.alpha() + alpha)
  );
};

export const changeColorHsla = (
  color: ColorInputType,
  change: HslaInputType
): string => {
  const _color = new Color(color);
  const {
    hue = _color.hue(),
    saturation = _color.saturationl(),
    lightness = _color.lightness(),
    alpha = _color.alpha()
  } = change;

  return toRgb(
    new Color(color)
      .hue(hue)
      .saturationl(saturation)
      .lightness(lightness)
      .alpha(alpha)
  );
};

export const getComplement = (color: ColorInputType): string => {
  const _color = new Color(color);
  return toRgb(new Color(color).hue((_color.hue() + 180) % 360));
};

export const getTriad = (color: ColorInputType): [string, string, string] => {
  const _color = new Color(color);
  return [
    toRgb(color),
    toRgb(new Color(color).hue((_color.hue() + 120) % 360)),
    toRgb(new Color(color).hue((_color.hue() + 240) % 360))
  ];
};

export const getTetrad = (
  color: ColorInputType
): [string, string, string, string] => {
  const _color = new Color(color);
  return [
    toRgb(color),
    toRgb(new Color(color).hue((_color.hue() + 90) % 360)),
    toRgb(new Color(color).hue((_color.hue() + 180) % 360)),
    toRgb(new Color(color).hue((_color.hue() + 270) % 360))
  ];
};

export const getSplitComplement = (
  color: ColorInputType
): [string, string, string] => {
  const _color = new Color(color);
  return [
    toRgb(color),
    toRgb(new Color(color).hue((_color.hue() + 72) % 360)),
    toRgb(new Color(color).hue((_color.hue() + 216) % 360))
  ];
};

/**
 * Returns the mixture of two colors.
 *
 * Gets the first color, second color and the percentage of the second color.
 */
export const mix = (
  color1: ColorInputType,
  color2: ColorInputType,
  amount: number
): string => {
  const mixAmount = amount === 0 ? 0 : amount || 50;
  const percentage = mixAmount / 100;

  const _color1 = new Color(color1);
  const _color2 = new Color(color2);

  const rgb = [
    (_color2.red() - _color1.red()) * percentage + _color1.red(),
    (_color2.green() - _color1.green()) * percentage + _color1.green(),
    (_color2.blue() - _color1.blue()) * percentage + _color1.blue()
  ];

  return toRgb(
    new Color(rgb, "rgb").alpha(
      (_color2.alpha() - _color1.alpha()) * percentage + _color1.alpha()
    )
  );
};

export const multiply = (
  color1: ColorInputType,
  color2: ColorInputType
): string => {
  const _color1 = new Color(color1);
  const _color2 = new Color(color2);

  const rgb = [
    Math.floor((_color1.red() * _color2.red()) / 255),
    Math.floor((_color1.green() * _color2.green()) / 255),
    Math.floor((_color1.blue() * _color2.blue()) / 255)
  ];

  return toRgb(new Color(rgb, "rgb"));
};

/**
 * Generates the color set from source color.
 */
export const generateColorSet = (color: ColorInputType): ColorSet => {
  const baseLight = Color("#ffffff").toString();
  const baseDark = multiply(color, color);

  return {
    50: mix(baseLight, color, 12),
    100: mix(baseLight, color, 30),
    200: mix(baseLight, color, 50),
    300: mix(baseLight, color, 70),
    400: mix(baseLight, color, 85),
    500: mix(baseLight, color, 100),
    600: mix(baseDark, color, 87),
    700: mix(baseDark, color, 70),
    800: mix(baseDark, color, 54),
    900: mix(baseDark, color, 25)
  };
};
