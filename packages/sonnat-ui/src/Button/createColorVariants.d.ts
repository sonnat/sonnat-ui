import { DefaultTheme } from "../styles";

export interface BorderColorVariants {
  main: string;
  hover: string;
  active: string;
  disabled: string;
}

export interface BackgroundColorVariants {
  main: string;
  hover: string;
  active: string;
  disabled: string;
}

export interface TextColorVariants {
  main: string;
  hover: string;
  active: string;
  disabled: string;
}

export interface FilledButton {
  background: Pick<BackgroundColorVariants, "main" | "hover" | "active">;
  text: string;
}

export interface OutlinedButton {
  border: BorderColorVariants;
  background: Pick<BackgroundColorVariants, "hover" | "active">;
  text: TextColorVariants;
}

export interface InlinedButton {
  background: Pick<BackgroundColorVariants, "hover" | "active">;
  text: TextColorVariants;
}

export interface ColorVariants {
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

export default function createColorVariants<T = DefaultTheme>(
  // eslint-disable-next-line no-unused-vars
  theme: T
): ColorVariants;
