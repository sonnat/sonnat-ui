import * as React from "react";
import usePreviousValue from "../utils/usePreviousValue";
import createColors from "./createColors";
import { type Theme } from "./createTheme";
import defaultTheme from "./defaultTheme";

const useDarkMode = (isDarkMode = false, theme = defaultTheme): Theme => {
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

  return newTheme;
};

export default useDarkMode;
