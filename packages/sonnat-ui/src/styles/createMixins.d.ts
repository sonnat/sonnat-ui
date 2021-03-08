/* eslint-disable no-unused-vars */
import { CSSProperties } from "react";
import { FontFamilies, TypographyUtils } from "./createTypography";

export interface Mixins {
  useDisableUserSelect: () => CSSProperties;
  useFontIcon: (identifier: string) => CSSProperties;
  useFontIconSize: (size: number = 16) => CSSProperties;
  usePreserveAspectRatio: (ratio: string = "1:1") => CSSProperties;
}

export interface MixinsInputs extends Partial<Mixins> {}

export interface MixinOptions {
  pxToRem: Pick<TypographyUtils, "pxToRem">;
  iconFontFamily: Pick<FontFamilies, "icon">;
}

export default function createMixins(
  mixins: MixinsInputs,
  options: MixinOptions
): Mixins;
