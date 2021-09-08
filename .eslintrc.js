const baseExtends = ["eslint:recommended"];

const jsExtends = [
  "plugin:react/recommended",
  "plugin:import/recommended",
  "plugin:import/errors",
  "plugin:import/warnings",
  "plugin:import/typescript",
  "prettier"
];

const defaultExtends = baseExtends.concat(jsExtends);

const tsExtends = baseExtends
  .concat("plugin:@typescript-eslint/recommended")
  .concat(jsExtends);

module.exports = {
  extends: defaultExtends,
  env: {
    browser: true,
    es6: true,
    node: true,
    commonjs: true
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    JSX: true
  },
  plugins: [
    "eslint-plugin-import",
    "eslint-plugin-react",
    "eslint-plugin-react-hooks",
    "@typescript-eslint/eslint-plugin"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    "no-alert": "error",
    "no-console": "warn",
    "prefer-const": "error",
    "default-case": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/react-in-jsx-scope": "off"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.d.ts"],
      extends: tsExtends,
      parserOptions: {
        sourceType: "module",
        project: ["./tsconfig.json"]
      }
    }
  ],
  settings: {
    react: {
      version: "detect"
    },
    "import/resolver": {
      alias: {
        map: [["@sonnat/ui", "./packages/sonnat-ui/src"]]
      }
    }
  }
};
