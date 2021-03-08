/* eslint-disable no-unused-vars */
import Color from "color";

export type ColorInputType = string | Color;

export interface ColorSetInterface {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export type HslaInputType = {
  hue?: number;
  saturation?: number;
  lightness?: number;
  alpha?: number;
};

export function toRgb(color: ColorInputType): string;

export function toHex(color: ColorInputType): string;

export function toHsl(color: ColorInputType): string;

export function getLuminance(color: ColorInputType): number;

export function calculateContrastRatio(
  foreground: ColorInputType,
  background: ColorInputType
): number;

export function darken(color: ColorInputType, tonalOffset: number): string;

export function lighten(color: ColorInputType, tonalOffset: number): string;

export function emphasize(
  color: ColorInputType,
  tonalOffset: number = 0.15
): string;

export function adjustColor(
  color: ColorInputType,
  adjustment: HslaInputType
): string;

export function changeColor(
  color: ColorInputType,
  change: HslaInputType
): string;

export function getComplement(color: ColorInputType): string;

export function getTriad(color: ColorInputType): string[];

export function getTetrad(color: ColorInputType): string[];

export function getSplitComplement(color: ColorInputType): string[];

export function mix(
  color1: ColorInputType,
  color2: ColorInputType,
  amount: number
): string;

export function multiply(
  color1: ColorInputType,
  color2: ColorInputType
): string;

export function generateColorSet(color: ColorInputType): ColorSetInterface;
