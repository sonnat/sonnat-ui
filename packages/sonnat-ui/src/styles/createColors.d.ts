/* eslint-disable no-unused-vars */
import { ColorInputType, HslaInputType } from "./colorUtils";
import { Pallete } from "./pallete";

export type TextType = {
  primary: string;
  secondary: string;
  disabled: string;
  hint: string;
};

export type BackgroundType = {
  origin: string;
  level: { 1: string; 2: string };
};

export type SystemColorVariantObject = {
  origin: string;
  light: string;
  dark: string;
};

export type SystemColorVariant = string | Partial<SystemColorVariantObject>;

export type DarkBaseColors = {
  text: TextType;
  divider: string;
  background: BackgroundType;
};

export type LightBaseColors = {
  text: TextType;
  divider: string;
  background: BackgroundType;
};

export interface Colors {
  primary: SystemColorVariantObject;
  secondary: SystemColorVariantObject;
  error: SystemColorVariantObject;
  warning: SystemColorVariantObject;
  info: SystemColorVariantObject;
  success: SystemColorVariantObject;
  transparent: string;
  contrastThreshold: number;
  text: TextType;
  divider: string;
  white: string;
  black: string;
  pallete: Pallete;
  background: BackgroundType;
  createPrimaryColor: (hsla: HslaInputType) => string;
  createSecondaryColor: (hsla: HslaInputType) => string;
  createBlackColor: (hsla: HslaInputType) => string;
  createWhiteColor: (hsla: HslaInputType) => string;
  getContrastColorOf: (background: ColorInputType) => string;
}

export interface ColorsInputs {
  primary?: SystemColorVariant;
  secondary?: SystemColorVariant;
  error?: SystemColorVariant;
  warning?: SystemColorVariant;
  info?: SystemColorVariant;
  success?: SystemColorVariant;
  contrastThreshold?: number;
}

export default function createColors(
  colors: ColorsInputs,
  themeMode: string
): Colors;
