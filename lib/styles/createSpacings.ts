import { type Typography } from "./createTypography";

export const DEFAULT_SPACER_PX = 16;

export interface SpacingsInput {
  spacer?: number;
}

const createSpacings = (
  spacingInput?: SpacingsInput,
  options?: { pxToRem: Typography["pxToRem"] }
) => {
  const { spacer = DEFAULT_SPACER_PX } = spacingInput || {};

  const {
    pxToRem = (size: number) =>
      typeof size === "number" && !isNaN(size) ? `${size / 16}rem` : ""
  } = options || {};

  return {
    gutter: pxToRem(spacer),
    spacer: { rem: pxToRem(spacer), px: spacer },
    spaces: {
      /** Equivalent to `2px`. */
      0: { rem: pxToRem(spacer * 0.125), px: spacer * 0.125 },
      /** Equivalent to `4px`. */
      1: { rem: pxToRem(spacer * 0.25), px: spacer * 0.25 },
      /** Equivalent to `6px`. */
      2: { rem: pxToRem(spacer * 0.375), px: spacer * 0.375 },
      /** Equivalent to `8px`. */
      3: { rem: pxToRem(spacer * 0.5), px: spacer * 0.5 },
      /** Equivalent to `10px`. */
      4: { rem: pxToRem(spacer * 0.625), px: spacer * 0.625 },
      /** Equivalent to `12px`. */
      5: { rem: pxToRem(spacer * 0.75), px: spacer * 0.75 },
      /** Equivalent to `14px`. */
      6: { rem: pxToRem(spacer * 0.875), px: spacer * 0.875 },
      /** Equivalent to `16px`. */
      7: { rem: pxToRem(spacer), px: spacer },
      /** Equivalent to `18px`. */
      8: { rem: pxToRem(spacer * 1.125), px: spacer * 1.125 },
      /** Equivalent to `20px`. */
      9: { rem: pxToRem(spacer * 1.25), px: spacer * 1.25 },
      /** Equivalent to `24px`. */
      10: { rem: pxToRem(spacer * 1.5), px: spacer * 1.5 }
    }
  };
};

export type Spacings = ReturnType<typeof createSpacings>;

export default createSpacings;
