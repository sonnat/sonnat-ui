export interface PalleteObject {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface Pallete {
  red: PalleteObject;
  pink: PalleteObject;
  purple: PalleteObject;
  deepPurple: PalleteObject;
  navy: PalleteObject;
  blue: PalleteObject;
  lightBlue: PalleteObject;
  aqua: PalleteObject;
  forest: PalleteObject;
  green: PalleteObject;
  lightGreen: PalleteObject;
  pear: PalleteObject;
  yellow: PalleteObject;
  orange: PalleteObject;
  deepOrange: PalleteObject;
  brown: PalleteObject;
  blueGrey: PalleteObject;
  grey: PalleteObject;
}

declare const pallete: Pallete;

export default pallete;
