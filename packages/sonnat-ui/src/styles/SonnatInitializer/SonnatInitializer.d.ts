import * as React from "react";
import type { GenerateClassName, Jss } from "../../typings";
import type { DefaultTheme } from "../defaultTheme";

export interface SonnatInitializerOptions<Theme = DefaultTheme> {
  /** Sonnat's theme object */
  theme?: Theme;
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

export interface SonnatInitializerProps extends SonnatInitializerOptions {
  children: React.ReactNode;
}

declare const SonnatInitializer: React.ComponentType<SonnatInitializerProps>;

export default SonnatInitializer;
