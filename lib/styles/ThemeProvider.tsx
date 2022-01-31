import PropTypes from "prop-types";
import React from "react";
import { ThemeProvider as JssThemeProvider } from "react-jss";
import type { DefaultTheme } from "./defaultTheme";

interface ThemeProviderProps<T = Partial<DefaultTheme>> {
  children: React.ReactNode;
  theme: NonNullable<T> | ((outerTheme: T) => NonNullable<T>);
}

interface IThemeProvider<T = Partial<DefaultTheme>> {
  (props: ThemeProviderProps<T>): JSX.Element;
  propTypes?: React.WeakValidationMap<ThemeProviderProps<T>> | undefined;
}

/**
 * This component takes a `theme` prop.
 * It makes the `theme` available down the React tree thanks to React context.
 * This component should preferably be used at **the root of your component tree**.
 */
const ThemeProvider: IThemeProvider = props => {
  const { children, theme } = props;

  if (theme == null)
    throw new Error(
      "[Sonnat]: `theme` prop is missing from the <ThemeProvider>!"
    );

  return <JssThemeProvider theme={theme}>{children}</JssThemeProvider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  theme: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired
};

export default ThemeProvider;
