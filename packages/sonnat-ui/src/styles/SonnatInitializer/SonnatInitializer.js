import jss, { create } from "jss";
import PropTypes from "prop-types";
import React from "react";
import { JssProvider } from "react-jss";
import createGenerateClassName from "../createGenerateClassName";
import defaultTheme from "../defaultTheme";
import jssPreset from "../jssPreset";
import { ServerContext } from "../ServerStyleSheets/Provider";
import ThemeProvider from "../ThemeProvider";

let injectFirstNode;

const isSsr = typeof window === "undefined";
const InitializerContext = React.createContext({ nested: false });

if (process.env.NODE_ENV !== "production") {
  InitializerContext.displayName = "InitializerContext";
}

// Use a singleton or the provided one by the context.
//
// The counter-based approach doesn't tolerate any mistake.
// It's much safer to use the same counter everywhere.
const defaultGenerateClassName = createGenerateClassName();

// Default JSS instance.
const defaultJss = create(jssPreset());

export default function SonnatInitializer(props) {
  const {
    children,
    theme = defaultTheme,
    generateClassName: localGenerateClassName,
    jss: jssOption,
    disableGeneration,
    injectFirst = false
  } = props;

  const { nested } = React.useContext(InitializerContext);
  const { generateServerClassName, sheetsRegistry } = React.useContext(
    ServerContext
  );

  if (nested) {
    throw new Error(
      "[Sonnat]: You cannot use `<SonnatInitializer>` as a nested provider!"
    );
  }

  if (!isSsr && generateServerClassName) {
    throw new Error(
      "[Sonnat]: You need to use the `ServerStyleSheets` API when rendering on the server."
    );
  }

  if (isSsr && !generateServerClassName) {
    throw new Error(
      "[Sonnat]: There is no `generateServerClassName` function provided on the server!"
    );
  }

  let jss = jssOption != null ? jssOption : defaultJss;

  const generateId = isSsr
    ? generateServerClassName
    : localGenerateClassName != null
    ? localGenerateClassName
    : defaultGenerateClassName;

  if (process.env.NODE_ENV !== "production") {
    if (jss.options.insertionPoint && injectFirst) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: You cannot use a custom `insertionPoint` and <StylesContext injectFirst> at the same time."
      );
    }
  }

  if (process.env.NODE_ENV !== "production") {
    if (injectFirst && jssOption) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: You cannot use the `jss` and `injectFirst` props at the same time."
      );
    }
  }

  if (
    !jss.options.insertionPoint &&
    injectFirst &&
    typeof window !== "undefined"
  ) {
    if (!injectFirstNode) {
      injectFirstNode = document.createComment("sonnat-inject-first");
      document.head.insertBefore(injectFirstNode, document.head.firstChild);
    }

    jss = create({
      plugins: jssPreset().plugins,
      insertionPoint: injectFirstNode
    });
  }

  return (
    <InitializerContext.Provider value={{ nested: true }}>
      <JssProvider
        registry={sheetsRegistry}
        jss={jss}
        generateId={generateId}
        disableStylesGeneration={disableGeneration}
      >
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </JssProvider>
    </InitializerContext.Provider>
  );
}

SonnatInitializer.propTypes = {
  children: PropTypes.node.isRequired,
  /** Sonnat's theme object */
  theme: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  /**
   * You can disable the generation of the styles with this option.
   * It can be useful when traversing the React tree outside of the HTML
   * rendering step on the server.
   * Let's say you are using react-apollo to extract all
   * the queries made by the interface server-side - you can significantly speed up the traversal with this prop.
   */
  disableGeneration: PropTypes.bool,
  /** JSS's class name generator. */
  generateClassName: PropTypes.func,
  /**
   * By default, the styles are injected last in the <head> element of the page.
   * As a result, they gain more specificity than any other style sheet.
   * If you want to override Sonnat's styles, set this prop.
   */
  injectFirst: PropTypes.bool,
  /** JSS's instance. */
  jss: PropTypes.instanceOf(jss.constructor)
};
