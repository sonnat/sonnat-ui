const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    { loader: MiniCssExtractPlugin.loader },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009"
            },
            stage: 3
          })
        ],
        sourceMap: true
      }
    }
  ];

  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: { sourceMap: true }
      },
      {
        loader: require.resolve(preProcessor),
        options: { sourceMap: true }
      }
    );
  }
  return loaders;
};

module.exports = {
  entry: "./client.js",
  mode: process.env.NODE_ENV || "development",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  resolve: {
    extensions: [".js", ".css", ".scss"]
  },
  module: {
    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            loader: require.resolve("babel-loader")
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: true
            }),
            sideEffects: true
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: true,
              modules: true
            })
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: true
              },
              "sass-loader"
            ),
            sideEffects: true
          },
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: true,
                modules: true
              },
              "sass-loader"
            )
          },
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: { name: "static/media/[name].[ext]" }
          }
        ]
      }
    ]
  }
};
