import jss, { create } from "jss";
import PropTypes from "prop-types";
import React from "react";
import { JssProvider } from "react-jss";
import type { GenerateClassName, Jss } from "../typings";
import createGenerateClassName from "./createGenerateClassName";
import defaultTheme, { DefaultTheme } from "./defaultTheme";
import jssPreset from "./jssPreset";
import { ServerContext } from "./ServerStyleSheets/Provider";
import ThemeProvider from "./ThemeProvider";

export interface SonnatInitializerOptions<T = DefaultTheme> {
  /** Sonnat's theme object */
  theme?: T;
  /**
   * You can disable the generation of the styles with this option.
   * It can be useful when traversing the React tree outside of the HTML
   * rendering step on the server.
   * Let's say you are using react-apollo to extract all
   * the queries made by the interface server-side - you can significantly speed up the traversal with this prop.
   */
  disableGeneration?: boolean;
  /** JSS's class name generator. */
  generateClassName?: GenerateClassName;
  /**
   * By default, the styles are injected last in the <head> element of the page.
   * As a result, they gain more specificity than any other style sheet.
   * If you want to override style injection's behaviour, set this prop.
   */
  injectFirst?: boolean;
  /** JSS's instance. */
  jss?: Jss;
}

interface SonnatInitializerProps extends SonnatInitializerOptions {
  children: React.ReactNode;
}

let injectFirstNode: Comment;

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

const SonnatInitializer = (props: SonnatInitializerProps): JSX.Element => {
  const {
    children,
    theme = defaultTheme,
    generateClassName: localGenerateClassName,
    jss: jssInput,
    disableGeneration,
    injectFirst = false
  } = props;

  const { nested } = React.useContext(InitializerContext);
  const { generateServerClassName, sheetsRegistry } =
    React.useContext(ServerContext);

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

  let jss = jssInput != null ? jssInput : defaultJss;

  const generateId = isSsr
    ? generateServerClassName
    : localGenerateClassName != null
    ? localGenerateClassName
    : defaultGenerateClassName;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const insertionPoint = (jss.options as unknown).insertionPoint as unknown;

  if (process.env.NODE_ENV !== "production") {
    if (insertionPoint && injectFirst) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: You cannot use a custom `insertionPoint` and <StylesContext injectFirst> at the same time."
      );
    }
  }

  if (process.env.NODE_ENV !== "production") {
    if (injectFirst && jssInput) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: You cannot use the `jss` and `injectFirst` props at the same time."
      );
    }
  }

  if (!insertionPoint && injectFirst && typeof window !== "undefined") {
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
};

export default SonnatInitializer;

SonnatInitializer.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  disableGeneration: PropTypes.bool,
  generateClassName: PropTypes.func,
  injectFirst: PropTypes.bool,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  jss: PropTypes.instanceOf(jss.constructor)
};
