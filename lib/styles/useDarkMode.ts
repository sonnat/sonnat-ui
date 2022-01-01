import * as React from "react";
import usePreviousValue from "../utils/usePreviousValue";
import createColors from "./createColors";
import defaultTheme, { type DefaultTheme } from "./defaultTheme";

const useDarkMode = <T = DefaultTheme>(
  isDarkMode = false,
  theme = defaultTheme
): T => {
  const cachedTheme = React.useRef(theme);
  const prevState = usePreviousValue(isDarkMode);

  const newTheme = React.useMemo(() => {
    if (isDarkMode !== prevState) {
      const {
        primary,
        secondary,
        error,
        warning,
        info,
        success,
        contrastThreshold
      } = cachedTheme.current.colors;

      return {
        ...cachedTheme.current,
        darkMode: isDarkMode,
        colors: createColors(
          {
            primary,
            secondary,
            error,
            warning,
            info,
            success,
            contrastThreshold
          },
          isDarkMode
        )
      };
    } else return cachedTheme.current;
  }, [prevState, isDarkMode]);

  cachedTheme.current = newTheme;

  return (<unknown>newTheme) as T;
};

export default useDarkMode;
