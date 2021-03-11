import { DefaultTheme } from "../defaultTheme";
import { Styles, StyleSheetFactoryOptions, Classes } from "jss";

interface MakeStylesOptions extends StyleSheetFactoryOptions {
  name?: string;
}

export default function makeStyles<
  Theme = DefaultTheme,
  C extends string = string
>(
  styles: Styles<C> | ((theme: Theme) => Styles<C>),
  options?: MakeStylesOptions<Theme>
): (data?: unknown) => Classes<C>;
