import Color from "color";

export type ColorSwatch = Record<
  50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  string
>;

export const BASE_LUMINANCE = 50;
export const BASE_LEVEL = 600;
export const BASE_LEVEL_INDEX = 6;

export const LUMINANCE_OFFSET_FROM_BASE = [
  45, 40, 36, 27, 18, 9, 0, -9, -18, -27
] as const;

const minmax = (value: number) => Math.max(Math.min(value, 0.99), 0.01);

const calcLevelLuminance = (levelIndex: number) =>
  minmax((BASE_LUMINANCE + LUMINANCE_OFFSET_FROM_BASE[levelIndex]) / 100);

const calcSaturation = (
  luminance: number,
  factor = -1.8,
  adjust = 1.8,
  shift = 0.4
) => minmax(luminance ** 2 * factor + luminance * adjust + shift);

export const generateColorLevel = (
  color: string | Color,
  levelIndex: number,
  saturationOffset = 0
) => {
  const colorHsl = new Color(color).hsl();

  const hue = colorHsl.hue() || 0;
  const luminance = calcLevelLuminance(levelIndex);
  const saturation = calcSaturation(luminance);

  const newColor = new Color(colorHsl)
    .hue(hue)
    .saturationl((saturation + saturationOffset) * 100)
    .lightness(luminance * 100);

  return newColor.hex().toString();
};

// Based on https://hypejunction.github.io/color-wizard/
// And https://uxplanet.org/designing-systematic-colors-b5d2605b15c
const generateColorSwatch = (color: string | Color, saturationOffset = 0) =>
  LUMINANCE_OFFSET_FROM_BASE.reduce(
    (swatch, _, index) => ({
      ...swatch,
      [index === 0 ? 50 : index * 100]: generateColorLevel(
        color,
        index,
        saturationOffset
      )
    }),
    {} as ColorSwatch
  );

export default generateColorSwatch;
