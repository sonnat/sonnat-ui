import { type Typography } from "./createTypography";

const createRadius = (options?: { pxToRem: Typography["pxToRem"] }) => {
  const {
    pxToRem = (size: number) =>
      typeof size === "number" && !isNaN(size) ? `${size / 16}rem` : ""
  } = options || {};

  return {
    /** Equivalent to `2px`. */
    xSmall: pxToRem(2),
    /** Equivalent to `4px`. */
    small: pxToRem(4),
    /** Equivalent to `8px`. */
    medium: pxToRem(8),
    /** Equivalent to `16px`. */
    large: pxToRem(16),
    rounded: 1024
  };
};

export type Radius = ReturnType<typeof createRadius>;

export default createRadius;
