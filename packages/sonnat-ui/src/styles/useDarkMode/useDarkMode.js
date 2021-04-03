import React from "react";
import { dark, light } from "../createColors";
import usePreviousValue from "../../utils/usePreviousValue";
import defaultTheme from "../defaultTheme";

export default function useDarkMode(isDarkMode = false, theme = defaultTheme) {
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

  return newTheme;
}
