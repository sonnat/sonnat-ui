import * as React from "react";
import usePreviousValue from "../utils/usePreviousValue";
import { type Theme } from "./createTheme";
import defaultTheme from "./defaultTheme";

const useDarkMode = (isDarkMode = false, theme = defaultTheme): Theme => {
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
