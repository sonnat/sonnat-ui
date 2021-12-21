import { generateColorSet, ColorSet } from "./colorUtils";

export const red = generateColorSet("#e53935");
export const pink = generateColorSet("#EA475B");
export const purple = generateColorSet("#B961CC");
export const deepPurple = generateColorSet("#7622BB");
export const navy = generateColorSet("#1A1A8D");
export const blue = generateColorSet("#3563E9");
export const lightBlue = generateColorSet("#2F98F5");
export const aqua = generateColorSet("#33BCD3");
export const forest = generateColorSet("#00695C");
export const green = generateColorSet("#2E7D32");
export const lightGreen = generateColorSet("#7CB342");
export const pear = generateColorSet("#CDDC39");
export const yellow = generateColorSet("#fdd835");
export const orange = generateColorSet("#ff9800");
export const deepOrange = generateColorSet("#E65100");
export const brown = generateColorSet("#A43C0C");
export const blueGrey = generateColorSet("#433E60");

export const grey: ColorSet = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#e0e0e0",
  400: "#bdbdbd",
  500: "#9e9e9e",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121"
};

const palette = {
  red,
  pink,
  purple,
  deepPurple,
  navy,
  blue,
  lightBlue,
  aqua,
  forest,
  green,
  lightGreen,
  pear,
  yellow,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey
};

export type Palette = typeof palette;

export default palette;
