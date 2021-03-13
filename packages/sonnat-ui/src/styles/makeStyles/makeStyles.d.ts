import { Classes, Styles, StyleSheetFactoryOptions } from "../../utils/typings";
import { DefaultTheme } from "../defaultTheme";

export interface MakeStylesOptions extends StyleSheetFactoryOptions {
  name?: string;
}

export default function makeStyles<
  Theme = DefaultTheme,
  C extends string = string
>(
  styles: Styles<Theme, C>,
  options?: MakeStylesOptions
): (data?: unknown) => Classes<C>;
