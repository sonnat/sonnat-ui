import {
  makeStyles,
  type Breakpoints,
  type Colors,
  type ColorSwatch,
  type DefaultTheme,
  type Swatches,
  type Typography,
  type ZIndexes
} from "../styles";

const reset = (theme: DefaultTheme) => ({
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
    color: !theme.darkMode
      ? theme.colors.text.dark.primary
      : theme.colors.text.light.primary,
    backgroundColor: !theme.darkMode
      ? theme.colors.background.light.origin
      : theme.colors.background.dark.origin,
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
    fontWeight: theme.typography.fontWeight.bold
  },
  strong: {
    fontWeight: theme.typography.fontWeight.bold
  },
  code: {
    fontFamily: theme.typography.fontFamily.monospace,
    fontSize: "1em"
  },
  kbd: {
    fontFamily: theme.typography.fontFamily.monospace,
    fontSize: "1em"
  },
  samp: {
    fontFamily: theme.typography.fontFamily.monospace,
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
    appearance: "button"
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
    appearance: "button"
  },
  '[type="reset"]': {
    appearance: "button"
  },
  '[type="submit"]': {
    appearance: "button"
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
    appearance: "textfield",
    outlineOffset: "-2px"
  },
  '[type="search"]::webkit-search-decoration': {
    appearance: "none"
  },
  "::webkit-file-upload-button": {
    appearance: "button",
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

const cssVariables = (theme: DefaultTheme) => {
  const { colors, swatches, breakpoints, zIndexes, typography } = theme;

  const colorVariables = (colors: Colors) => {
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
        if (!colors[key as keyof Colors]) return variables;

        const rootColor = colors[key as keyof Colors];

        type VKey = keyof typeof rootColor;

        if (typeof rootColor !== "string") {
          return {
            ...variables,
            ...Object.keys(rootColor).reduce((variants, vkey) => {
              if (typeof rootColor[vkey as VKey] !== "string") {
                return {
                  ...variables,
                  ...Object.keys(rootColor[vkey as VKey]).reduce(
                    (subVariants, vvkey) => {
                      return {
                        ...subVariants,
                        [`--snt-${key}-${vkey}-${vvkey}-color`]:
                          rootColor[vkey as VKey][vvkey]
                      };
                    },
                    {}
                  )
                };
              } else {
                return {
                  ...variants,
                  [`--snt-${key}-${vkey}-color`]: rootColor[vkey as VKey]
                };
              }
            }, {})
          };
        } else return { ...variables, [`--snt-${key}-color`]: rootColor };
      } else return variables;
    }, {});
  };

  const swatchesVariables = (swatches: Swatches) => {
    return Object.keys(swatches).reduce((rules, key) => {
      const children = Object.keys(swatches[key as keyof Swatches]);

      return {
        ...rules,
        ...children.reduce(
          (variants, vkey) => ({
            ...variants,
            [`--snt-${key}-${vkey}`]:
              swatches[key as keyof Swatches][
                vkey as unknown as keyof ColorSwatch
              ]
          }),
          {}
        )
      };
    }, {});
  };

  const breakpointVariables = (breakpoints: Breakpoints) => {
    return Object.keys(breakpoints.values).reduce(
      (rules, key) => ({
        ...rules,
        [`--snt-breakpoint-${key}`]: `${
          breakpoints.values[key as keyof typeof breakpoints.values]
        }px`
      }),
      {}
    );
  };

  const zIndexVariables = (zIndexes: ZIndexes) => {
    return Object.keys(zIndexes).reduce(
      (rules, key) => ({ ...rules, [`--snt-zindex-${key}`]: zIndexes[key] }),
      {}
    );
  };

  const typographyVariables = (typography: Typography) => {
    return {
      "--snt-html-font-size": `${typography.htmlFontSize}px`,
      "--snt-base-font-size": `${typography.fontSize}px`,
      "--snt-ltr-font-family": typography.fontFamily.ltr,
      "--snt-rtl-font-family": typography.fontFamily.rtl
    };
  };

  return {
    ":root": {
      ...colorVariables(colors),
      ...swatchesVariables(swatches),
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
  { name: "SonnatCssBaseline" }
);

export default useStyles;
