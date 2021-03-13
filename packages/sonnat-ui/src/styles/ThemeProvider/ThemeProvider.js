import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider as JssThemeProvider } from "react-jss";

/**
 * This component takes a `theme` prop.
 * It makes the `theme` available down the React tree thanks to React context.
 * This component should preferably be used at **the root of your component tree**.
 */
function ThemeProvider(props) {
  const { children, theme } = props;

  if (theme == null)
    throw new Error(
      "[Sonnat]: `theme` prop is missing from the <ThemeProvider>!"
    );

  return <JssThemeProvider theme={theme}>{children}</JssThemeProvider>;
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired
};

export default ThemeProvider;
