import type { JssOptions } from "jss";
import camelCase from "jss-plugin-camel-case";
import defaultUnit from "jss-plugin-default-unit";
import extend from "jss-plugin-extend";
import global from "jss-plugin-global";
import nested from "jss-plugin-nested";
import propsSort from "jss-plugin-props-sort";
import functions from "jss-plugin-rule-value-function";
import vendorPrefixer from "jss-plugin-vendor-prefixer";

const basePlugins = [
  functions(),
  global(),
  extend(),
  nested(),
  camelCase(),
  defaultUnit(),
  propsSort()
];

/** Subset of jss-preset-default with only the plugins the Sonnat components are using. */
const jssPreset = (): Pick<JssOptions, "plugins"> => {
  return {
    plugins:
      typeof window === "undefined"
        ? basePlugins
        : // Disable the vendor prefixer on server-side, it does nothing.
          // This way, we can get a performance boost.
          // Instead, we can use `autoprefixer` on the server.
          [...basePlugins, vendorPrefixer()]
  };
};

export default jssPreset;
