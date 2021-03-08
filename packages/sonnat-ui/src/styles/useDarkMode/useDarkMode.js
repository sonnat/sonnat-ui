import { dark, light } from "../createColors";
import usePreviousValue from "../../utils/usePreviousValue";
import defaultTheme from "../defaultTheme";

export default function useDarkMode(isDarkMode = false, theme = defaultTheme) {
  let currentTheme = theme;

  const prevState = usePreviousValue(isDarkMode);

  if (prevState != null && isDarkMode !== prevState) {
    return {
      ...theme,
      colors: { ...theme.colors, ...(isDarkMode ? dark : light) },
      darkMode: isDarkMode
    };
  }

  return currentTheme;
}
