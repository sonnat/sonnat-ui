const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

const babelConfigFile = path.resolve(
  process.cwd(),
  "../../",
  "babel.config.js"
);

module.exports = function () {
  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/umd.entry.js",
    output: {
      path: path.resolve(__dirname, "../dist"),
      filename: "umd/sonnat.min.js",
      library: "Sonnat",
      libraryTarget: "umd",
      globalObject: "typeof self !== 'undefined' ? self : this"
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          loader: require.resolve("babel-loader"),
          exclude: /node_modules/,
          options: {
            cacheDirectory: true,
            configFile: babelConfigFile
          }
        }
      ]
    },
    resolve: {
      extensions: [".js", ".jsx", ".scss"]
    },
    externals: {
      react: {
        commonjs: "react",
        commonjs2: "react",
        amd: "react",
        root: "React"
      },
      "react-dom": {
        commonjs: "react-dom",
        commonjs2: "react-dom",
        amd: "react-dom",
        root: "ReactDOM"
      },
      "prop-types": {
        commonjs: "prop-types",
        commonjs2: "prop-types",
        amd: "prop-types",
        root: "PropTypes"
      }
    }
  };
};
