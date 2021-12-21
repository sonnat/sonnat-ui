export const gutter = 16 as const;
export const space = gutter;

export interface Spacings extends Record<string, unknown> {
  gutter: number;
  space: number;
}

const createSpacings = <T extends Partial<Spacings>>(
  spacingInput?: T
): T & Spacings => {
  const { gutter, space, ...other } = spacingInput || {};

  return { gutter, space, ...other } as T & Spacings;
};

export default createSpacings;
