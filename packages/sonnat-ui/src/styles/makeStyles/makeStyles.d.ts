import type { Classes, Styles, MakeStylesOptions } from "../../typings";
import type { DefaultTheme } from "../defaultTheme";

export default function makeStyles<
  Theme = DefaultTheme,
  Props = unknown,
  Name extends string = string
>(
  styles: Styles<Theme, Props, Name>,
  options?: MakeStylesOptions
): (data?: Props & { theme?: Theme }) => Classes<Name>;
