import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "../styles";
import { useEnhancedEffect } from "../utils";

const componentName = "CssBaseline";

const reset = theme => ({
  html: {
    lineHeight: "1.15",
    WebkitTextSizeAdjust: "100%",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
    boxSizing: "border-box"
  },
  body: {
    margin: "0",
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.origin,
    '&[dir="rtl"]': {
      fontFamily: theme.typography.fontFamily.rtl,
      direction: "rtl"
    },
    '&[dir="ltr"], &:not([dir="ltr"]):not([dir="rtl"])': {
      fontFamily: theme.typography.fontFamily.ltr,
      direction: "ltr"
    }
  },
  main: {
    display: "block"
  },
  h1: {
    fontSize: "2em",
    margin: "0.67em 0"
  },
  hr: {
    boxSizing: "content-box",
    height: "0",
    overflow: "visible"
  },
  pre: {
    fontFamily: "monospace, monospace",
    fontSize: "1em"
  },
  a: {
    backgroundColor: "transparent"
  },
  "abbr[title]": {
    borderBottom: "none",
    textDecoration: "underline dotted"
  },
  b: {
    fontWeight: "bolder"
  },
  strong: {
    fontWeight: "bolder"
  },
  code: {
    fontFamily: "monospace, monospace",
    fontSize: "1em"
  },
  kbd: {
    fontFamily: "monospace, monospace",
    fontSize: "1em"
  },
  samp: {
    fontFamily: "monospace, monospace",
    fontSize: "1em"
  },
  small: {
    fontSize: "80%"
  },
  sub: {
    bottom: "-0.25em"
  },
  sup: {
    top: "-0.5em"
  },
  img: {
    borderStyle: "none"
  },
  button: {
    WebkitAppearance: "button"
  },
  input: {
    overflow: "visible"
  },
  optgroup: {
    fontFamily: "inherit",
    fontSize: "100%",
    lineHeight: "1.15",
    margin: "0"
  },
  select: {
    textTransform: "none"
  },
  textarea: {
    overflow: "auto"
  },
  '[type="button"]': {
    WebkitAppearance: "button"
  },
  '[type="reset"]': {
    WebkitAppearance: "button"
  },
  '[type="submit"]': {
    WebkitAppearance: "button"
  },
  "button::moz-focus-inner": {
    borderStyle: "none",
    padding: "0"
  },
  "[type='button']::moz-focus-inner": {
    borderStyle: "none",
    padding: "0"
  },
  "[type='reset']::moz-focus-inner": {
    borderStyle: "none",
    padding: "0"
  },
  "[type='submit']::moz-focus-inner": {
    borderStyle: "none",
    padding: "0"
  },
  "button:moz-focusring": {
    outline: "1px dotted ButtonText"
  },
  '[type="button"]:moz-focusring': {
    outline: "1px dotted ButtonText"
  },
  '[type="reset"]:moz-focusring': {
    outline: "1px dotted ButtonText"
  },
  '[type="submit"]:moz-focusring': {
    outline: "1px dotted ButtonText"
  },
  fieldset: {
    padding: "0.35em 0.75em 0.625em"
  },
  legend: {
    boxSizing: "border-box",
    color: "inherit",
    display: "table",
    maxWidth: "100%",
    padding: "0",
    whiteSpace: "normal"
  },
  progress: {
    verticalAlign: "baseline"
  },
  '[type="checkbox"]': {
    boxSizing: "border-box",
    padding: "0"
  },
  '[type="radio"]': {
    boxSizing: "border-box",
    padding: "0"
  },
  '[type="number"]::webkit-inner-spin-button': {
    height: "auto"
  },
  '[type="number"]::webkit-outer-spin-button': {
    height: "auto"
  },
  '[type="search"]': {
    WebkitAppearance: "textfield",
    outlineOffset: "-2px"
  },
  '[type="search"]::webkit-search-decoration': {
    WebkitAppearance: "none"
  },
  "::webkit-file-upload-button": {
    WebkitAppearance: "button",
    font: "inherit"
  },
  details: {
    display: "block"
  },
  summary: {
    display: "list-item"
  },
  template: {
    display: "none"
  },
  "[hidden]": {
    display: "none"
  },
  "*, *::before, *::after, *:before, *:after": {
    boxSizing: "inherit",
    WebkitTapHighlightColor: "rgba(0, 0, 0, 0) !important"
  }
});

const cssVariables = theme => {
  const { colors, breakpoints, zIndexes, typography } = theme;

  const colorVariables = colors => {
    const whiteListProps = [
      "primary",
      "secondary",
      "black",
      "background",
      "white",
      "divider",
      "error",
      "text",
      "warning",
      "success",
      "info"
    ];

    return Object.keys(colors).reduce((variables, key) => {
      if (whiteListProps.includes(key)) {
        if (!colors[key]) return variables;

        const rootColor = colors[key];

        if (typeof rootColor !== "string") {
          return {
            ...variables,
            ...Object.keys(rootColor).reduce((variants, vkey) => {
              if (typeof rootColor[vkey] !== "string") {
                return {
                  ...variables,
                  ...Object.keys(rootColor[vkey]).reduce(
                    (subVariants, vvkey) => {
                      return {
                        ...subVariants,
                        [`--snt-${key}-${vkey}-${vvkey}-color`]: rootColor[
                          vkey
                        ][vvkey]
                      };
                    },
                    {}
                  )
                };
              } else {
                return {
                  ...variants,
                  [`--snt-${key}-${vkey}-color`]: rootColor[vkey]
                };
              }
            }, {})
          };
        } else return { ...variables, [`--snt-${key}-color`]: rootColor };
      } else return variables;
    }, {});
  };

  const palleteVariables = pallete => {
    return Object.keys(pallete).reduce((rules, key) => {
      const children = Object.keys(pallete[key]);

      return {
        ...rules,
        ...children.reduce(
          (variants, vkey) => ({
            ...variants,
            [`--snt-${key}-${vkey}`]: pallete[key][vkey]
          }),
          {}
        )
      };
    }, {});
  };

  const breakpointVariables = breakpoints => {
    return Object.keys(breakpoints.values).reduce(
      (rules, key) => ({
        ...rules,
        [`--snt-breakpoint-${key}`]: `${breakpoints.values[key]}px`
      }),
      {}
    );
  };

  const zIndexVariables = zIndexes => {
    return Object.keys(zIndexes).reduce(
      (rules, key) => ({ ...rules, [`--snt-zindex-${key}`]: zIndexes[key] }),
      {}
    );
  };

  const typographyVariables = typography => {
    return {
      "--snt-html-font-size": `${typography.htmlFontSize}px`,
      "--snt-base-font-size": `${typography.fontSize}px`,
      "--snt-icon-font-family": typography.fontFamily.icon,
      "--snt-ltr-font-family": typography.fontFamily.ltr,
      "--snt-rtl-font-family": typography.fontFamily.rtl
    };
  };

  return {
    ":root": {
      ...colorVariables(colors),
      ...palleteVariables(colors.pallete),
      ...breakpointVariables(breakpoints),
      ...zIndexVariables(zIndexes),
      ...typographyVariables(typography)
    }
  };
};

const useStyles = makeStyles(
  theme => ({
    "@global": {
      ...reset(theme),
      ...cssVariables(theme)
    }
  }),
  { name: `Sonnat${componentName}` }
);

const CssBaseline = ({ children }) => {
  useStyles();

  const theme = useTheme();

  useEnhancedEffect(() => {
    document.body.dir = theme.direction;
  }, [theme.direction]);

  return <React.Fragment>{children}</React.Fragment>;
};

CssBaseline.displayName = componentName;

CssBaseline.propTypes = {
  children: PropTypes.node
};

export default CssBaseline;
