/* eslint-disable no-unused-vars */
import { ClassNameMap, Styles, MakeStylesOptions } from "../../utils/typings";
import { DefaultTheme } from "../defaultTheme";

export default function makeStyles<
  Theme = DefaultTheme,
  Props extends object = {},
  ClassKey extends string = string
>(
  styles: Styles<Theme, Props, ClassKey>,
  options?: MakeStylesOptions
): keyof Props extends never
  ? (data?: any) => ClassNameMap<ClassKey>
  : (data: Props) => ClassNameMap<ClassKey>;
