import { createUseStyles } from "react-jss";
import type { Classes, MakeStylesOptions, Styles } from "../typings";
import type { DefaultTheme } from "./defaultTheme";

const makeStyles = <T = DefaultTheme, P = unknown, N extends string = string>(
  styles: Styles<T, P, N>,
  options: MakeStylesOptions = {}
): ((data?: P & { theme?: T }) => Classes<N>) => {
  const {
    name,
    classNamePrefix: classNamePrefixOption,
    meta: metaOption,
    ...sheetOptions
  } = options;

  const classNamePrefix = name || classNamePrefixOption || "Sonnat";
  const meta = metaOption || classNamePrefix;

  return createUseStyles<N, P, T>(styles, {
    classNamePrefix,
    name,
    meta,
    ...sheetOptions
  });
};

export default makeStyles;
