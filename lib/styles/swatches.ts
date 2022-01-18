import generateColorSwatch from "./generateColorSwatch";

export const red = generateColorSwatch("#ec1313");
export const pink = generateColorSwatch("#ec135f");
export const purple = generateColorSwatch("#c113ec");
export const deepPurple = generateColorSwatch("#9656d6");
export const violet = generateColorSwatch("#4913ec");
export const navy = generateColorSwatch("#1337ec");
export const blue = generateColorSwatch("#1387ec");
export const aqua = generateColorSwatch("#13cfec");
export const teal = generateColorSwatch("#13ecab");
export const green = generateColorSwatch("#13ec3b");
export const lime = generateColorSwatch("#92ec13");
export const yellow = generateColorSwatch("#eca013");
export const orange = generateColorSwatch("#ec6a13");
export const grey = generateColorSwatch("#000000", -100);

const swatches = {
  red,
  pink,
  purple,
  deepPurple,
  violet,
  navy,
  blue,
  aqua,
  teal,
  green,
  lime,
  yellow,
  orange,
  grey
};

export type Swatches = typeof swatches;

export default swatches;
