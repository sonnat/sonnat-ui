import Color from "color";

export type ColorInputType = string | Color;

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

export const darken = (color: ColorInputType, tonalOffset: number): string =>
  toRgb(new Color(color).darken(tonalOffset));

export const lighten = (color: ColorInputType, tonalOffset: number): string =>
  toRgb(new Color(color).lighten(tonalOffset));

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

export const opaquify = (
  translucentForeground: ColorInputType,
  opaqueBackground: ColorInputType
) => {
  const fg = new Color(translucentForeground);
  const bg = new Color(opaqueBackground);

  const alpha = fg.alpha();

  return new Color([
    (1 - alpha) * bg.red() + alpha * fg.red(),
    (1 - alpha) * bg.green() + alpha * fg.green(),
    (1 - alpha) * bg.blue() + alpha * fg.blue()
  ])
    .hex()
    .toString();
};
