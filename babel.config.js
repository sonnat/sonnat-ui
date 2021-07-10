let defaultPresets;

if (process.env.BABEL_ENV !== "es") {
  defaultPresets = [
    [
      "@babel/preset-env",
      {
        bugfixes: true,
        modules: ["esm", "umd"].includes(process.env.BABEL_ENV)
          ? false
          : "commonjs"
      }
    ]
  ];
} else defaultPresets = [];

module.exports = {
  ignore: [/@babel[\\|/]runtime/], // Fix a Windows issue.
  presets: defaultPresets.concat([
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]),
  plugins: [
    "@babel/plugin-transform-object-assign",
    ["@babel/plugin-transform-runtime", { version: "^7.4.4" }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-object-rest-spread", { loose: true }],
    ["@babel/plugin-proposal-private-methods", { loose: true }]
  ],
  env: {
    cjs: {},
    esm: {
      plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]]
    },
    es: {
      plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]]
    },
    production: {
      plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]]
    },
    umd: {
      plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]]
    }
  }
};
