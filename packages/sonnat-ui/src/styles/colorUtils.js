/* eslint-disable no-unused-vars */
import Color from "color";

/**
 * Converts any color to CSS rgb format.
 *
 * @param {import("./colorUtils").ColorInputType} color The color to be converted.
 * @returns {string} A CSS rgb color string.
 */
export function toRgb(color) {
  return Color(color).rgb().toString();
}

/**
 * Converts any color to CSS hex format.
 *
 * @param {import("./colorUtils").ColorInputType} color The color to be converted.
 * @returns {string} A CSS hex color string.
 */
export function toHex(color) {
  return Color(color).hex().toString();
}

/**
 * Converts any color to hsl format.
 *
 * @param {import("./colorUtils").ColorInputType} color The color to be converted.
 * @returns {string} A CSS hsl color string.
 */
export function toHsl(color) {
  return Color(color).hsl().toString();
}

/**
 * Calculates the relative brightness of any point in a color space.
 *
 * @param {import("./colorUtils").ColorInputType} color The color.
 * @returns {number} The relative brightness of the color in the range 0 (black) to 1 (white).
 */
export function getLuminance(color) {
  return Color(color).luminosity();
}

/**
 * Calculates the contrast ratio between two colors.
 *
 * @param {import("./colorUtils").ColorInputType} foreground The foreground color.
 * @param {import("./colorUtils").ColorInputType} background The background color.
 * @returns {number} A contrast ratio value in the range 1 (same color) to 21 (contrast b/w white and black).
 */
export function calculateContrastRatio(foreground, background) {
  return Color(foreground).contrast(Color(background));
}

/**
 * Darkens a color.
 *
 * @param {import("./colorUtils").ColorInputType} color The color that is going to be darker.
 * @param {number} tonalOffset The multiplier in the range 0 to 1.
 * @returns {string} A CSS rgb color string.
 */
export function darken(color, tonalOffset) {
  return toRgb(Color(color).darken(tonalOffset));
}

/**
 * Lightens a color.
 *
 * @param {import("./colorUtils").ColorInputType} color The color that is going to be lighter.
 * @param {number} tonalOffset The multiplier in the range 0 to 1.
 * @returns {string} A CSS rgb color string.
 */
export function lighten(color, tonalOffset) {
  return toRgb(Color(color).lighten(tonalOffset));
}

/**
 * Darken or lighten a color, depending on its luminance.
 * Light colors are darkened, dark colors are lightened.
 *
 * @param {import("./colorUtils").ColorInputType} color The color that is going to have emphasize.
 * @param {number} [tonalOffset=0.15] The multiplier in the range 0 to 1.
 * @returns {string} A CSS rgb color string.
 */
export function emphasize(color, tonalOffset = 0.15) {
  return getLuminance(color) > 0.5
    ? darken(color, tonalOffset)
    : lighten(color, tonalOffset);
}

/**
 * Increases or decreases one or more properties of a color.
 *
 * @param {import("./colorUtils").ColorInputType} color The color that is going to be adjusted.
 * @param {import("./colorUtils").HslaInputType} adjustment The adjustments to be done.
 * @returns {string} A CSS rgb color string.
 */
export function adjustColor(color, adjustment) {
  const _color = Color(color);
  const { hue = 0, saturation = 0, lightness = 0, alpha = 0 } = adjustment;

  return toRgb(
    Color(color)
      .hue(_color.hue() + hue)
      .saturationl(_color.saturationl() + saturation)
      .lightness(_color.lightness() + lightness)
      .alpha(_color.alpha() + alpha)
  );
}

/**
 * Changes one or more properties of a color.
 *
 * @param {import("./colorUtils").ColorInputType} color The color that is going to be changed.
 * @param {import("./colorUtils").HslaInputType} change The changes to be done.
 * @returns {string} A CSS rgb color string.
 */
export function changeColor(color, change) {
  const _color = Color(color);
  const {
    hue = _color.hue(),
    saturation = _color.saturationl(),
    lightness = _color.lightness(),
    alpha = _color.alpha()
  } = change;

  return toRgb(
    Color(color)
      .hue(hue)
      .saturationl(saturation)
      .lightness(lightness)
      .alpha(alpha)
  );
}

/**
 * Returns the complementary color.
 *
 * @param {import("./colorUtils").ColorInputType} color The source color.
 * @returns {string} A CSS rgb color string.
 */
export function getComplement(color) {
  const _color = Color(color);
  return toRgb(Color(color).hue((_color.hue() + 180) % 360));
}

/**
 * Returns the triad colors.
 *
 * @param {import("./colorUtils").ColorInputType} color The source color.
 * @returns {string[]} A triad of CSS rgb color strings.
 */
export function getTriad(color) {
  const _color = Color(color);
  return [
    toRgb(color),
    toRgb(Color(color).hue((_color.hue() + 120) % 360)),
    toRgb(Color(color).hue((_color.hue() + 240) % 360))
  ];
}

/**
 * Returns the tetrad colors.
 *
 * @param {import("./colorUtils").ColorInputType} color The source color.
 * @returns {string[]} A tetrad of CSS rgb color strings.
 */
export function getTetrad(color) {
  const _color = Color(color);
  return [
    toRgb(color),
    toRgb(Color(color).hue((_color.hue() + 90) % 360)),
    toRgb(Color(color).hue((_color.hue() + 180) % 360)),
    toRgb(Color(color).hue((_color.hue() + 270) % 360))
  ];
}

/**
 * Returns the split complementary colors.
 *
 * @param {import("./colorUtils").ColorInputType} color The source color.
 * @returns {string[]} A tetrad of CSS rgb color strings.
 */
export function getSplitComplement(color) {
  const _color = Color(color);
  return [
    toRgb(color),
    toRgb(Color(color).hue((_color.hue() + 72) % 360)),
    toRgb(Color(color).hue((_color.hue() + 216) % 360))
  ];
}

/**
 * Returns the mixture of two colors.
 *
 * @param {import("./colorUtils").ColorInputType} color1 First color.
 * @param {import("./colorUtils").ColorInputType} color2 Second color.
 * @param {number} amount The percentage of the second color.
 * @returns {string} A CSS rgb color string.
 */
export function mix(color1, color2, amount) {
  const mixAmount = amount === 0 ? 0 : amount || 50;
  const percentage = mixAmount / 100;

  const _color1 = Color(color1);
  const _color2 = Color(color2);

  const rgb = [
    (_color2.red() - _color1.red()) * percentage + _color1.red(),
    (_color2.green() - _color1.green()) * percentage + _color1.green(),
    (_color2.blue() - _color1.blue()) * percentage + _color1.blue()
  ];

  return toRgb(
    Color.rgb(rgb).alpha(
      (_color2.alpha() - _color1.alpha()) * percentage + _color1.alpha()
    )
  );
}

/**
 * Returns the product of multiplying two colors.
 *
 * @param {import("./colorUtils").ColorInputType} color1 First color.
 * @param {import("./colorUtils").ColorInputType} color2 Second color.
 * @returns {string} A CSS rgb color string.
 */
export function multiply(color1, color2) {
  const _color1 = Color(color1);
  const _color2 = Color(color2);

  const rgb = [
    Math.floor((_color1.red() * _color2.red()) / 255),
    Math.floor((_color1.green() * _color2.green()) / 255),
    Math.floor((_color1.blue() * _color2.blue()) / 255)
  ];

  return toRgb(Color.rgb(rgb));
}

/**
 * Generates the color set from source color.
 *
 * @param {import("./colorUtils").ColorInputType} color The source color.
 */
export function generateColorSet(color) {
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
}
