import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import nodeGlobals from "rollup-plugin-node-globals";
import { terser } from "rollup-plugin-terser";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";

const globals = {
  react: "React",
  "react-dom": "ReactDOM",
  "prop-types": "PropTypes"
};

const babelOptions = {
  exclude: /node_modules/,
  babelHelpers: "runtime",
  configFile: "../../babel.config.js"
};

const commonjsOptions = {
  ignoreGlobal: true,
  include: /node_modules/
};

const jsonOptions = {
  compact: true
};

const defaultPlugins = [
  json(jsonOptions),
  nodeResolve(),
  babel(babelOptions),
  commonjs(commonjsOptions),
  nodeGlobals()
];

export default {
  output: { format: "umd", globals },
  external: Object.keys(globals),
  plugins: defaultPlugins.concat([
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true
    }),
    sizeSnapshot({ snapshotPath: "size-snapshot.json" }),
    terser()
  ])
};
