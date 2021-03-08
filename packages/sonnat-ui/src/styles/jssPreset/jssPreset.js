import functions from "jss-plugin-rule-value-function";
import global from "jss-plugin-global";
import nested from "jss-plugin-nested";
import extend from "jss-plugin-extend";
import camelCase from "jss-plugin-camel-case";
import defaultUnit from "jss-plugin-default-unit";
import vendorPrefixer from "jss-plugin-vendor-prefixer";
import propsSort from "jss-plugin-props-sort";

// Subset of jss-preset-default with only the plugins the Sonnat components are using.
export default function jssPreset() {
  return {
    plugins: [
      functions(),
      global(),
      extend(),
      nested(),
      camelCase(),
      defaultUnit(),
      // Disable the vendor prefixer server-side, it does nothing.
      // This way, we can get a performance boost.
      // Instead, we can use `autoprefixer` to solve this problem on the server.
      typeof window === "undefined" ? null : vendorPrefixer(),
      propsSort()
    ]
  };
}
