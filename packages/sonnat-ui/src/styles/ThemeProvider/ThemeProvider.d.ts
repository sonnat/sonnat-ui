/* eslint-disable no-unused-vars */
import * as React from "react";
import { DefaultTheme } from "../defaultTheme";

export interface ThemeProviderProps<Theme = DefaultTheme> {
  children: React.ReactNode;
  theme: NonNullable<Theme> | ((outerTheme: Theme) => NonNullable<Theme>);
}

export default function ThemeProvider<Theme = DefaultTheme>(
  props: ThemeProviderProps<Theme>
): React.ReactElement<ThemeProviderProps<Theme>>;
