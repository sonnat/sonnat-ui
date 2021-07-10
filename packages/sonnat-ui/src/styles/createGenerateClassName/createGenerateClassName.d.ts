import { GenerateClassName } from "../../typings";

export interface GenerateClassNameOptions {
  disableGlobal?: boolean;
  productionPrefix?: string;
  seed?: string;
}

export default function createGenerateClassName(
  // eslint-disable-next-line no-unused-vars
  options?: GenerateClassNameOptions
): GenerateClassName;
