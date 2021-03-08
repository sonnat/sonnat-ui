export const gutter = 16;
export const space = gutter;

export default spacings => {
  return { gutter, space, ...spacings };
};
