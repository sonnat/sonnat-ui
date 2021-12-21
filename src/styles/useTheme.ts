import { useTheme as jssUseTheme } from "react-jss";
import type { DefaultTheme } from "./defaultTheme";

const useTheme = <T = DefaultTheme>(): T => jssUseTheme<T>();

export default useTheme;
