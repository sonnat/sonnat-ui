import React from "react";
import usePreviousValue from "../utils/usePreviousValue";
import { dark, light } from "./createColors";
import defaultTheme, { DefaultTheme } from "./defaultTheme";

const useDarkMode = <T = DefaultTheme>(
  isDarkMode = false,
  theme = defaultTheme
): T => {
  const cachedTheme = React.useRef(theme);
  const prevState = usePreviousValue(isDarkMode);

  const newTheme = React.useMemo(() => {
    if (isDarkMode !== prevState) {
      return {
        ...cachedTheme.current,
        colors: {
          ...cachedTheme.current.colors,
          ...(isDarkMode ? dark : light)
        },
        darkMode: isDarkMode
      };
    } else return cachedTheme.current;
  }, [prevState, isDarkMode]);

  cachedTheme.current = newTheme;

  return (<unknown>newTheme) as T;
};

export default useDarkMode;
