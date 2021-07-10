import type { CSSProperties } from "react";
import type { TypographyUtils } from "./createTypography";

export interface Mixins {
  useDisableUserSelect: () => CSSProperties;
  useIconWrapper: (size?: number) => CSSProperties;
  usePreserveAspectRatio: (ratio: string = "1:1") => CSSProperties;
}

export interface MixinsInputs extends Partial<Mixins> {
  [P: string]: any;
}

export interface MixinOptions {
  pxToRem: Pick<TypographyUtils, "pxToRem">;
}

export default function createMixins(
  mixins: MixinsInputs,
  options: MixinOptions
): Mixins;
