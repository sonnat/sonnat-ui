import * as React from "react";
import usePreviousValue from "../utils/usePreviousValue";
import defaultTheme, { type DefaultTheme } from "./defaultTheme";
import type { Theme } from "./createTheme";

const useDarkMode = <T extends Theme = DefaultTheme>(
  isDarkMode = false,
  theme: T = defaultTheme as T
): T => {
  const cachedTheme = React.useRef(theme);
  const prevState = usePreviousValue(isDarkMode);

  const newTheme = React.useMemo(() => {
    if (isDarkMode !== prevState) {
      return { ...cachedTheme.current, darkMode: isDarkMode };
    } else return cachedTheme.current;
  }, [prevState, isDarkMode]);

  cachedTheme.current = newTheme;

  return newTheme;
};

export default useDarkMode;
