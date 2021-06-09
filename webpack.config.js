const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackModules = require("webpack-modules");

const dirNode = "node_modules";
const dirApp = path.join(__dirname, "src");
const dirAssets = path.join(__dirname, "assets");

const analyze = process.env.ANALYZE;
/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

const plugins = [
  new webpack.ProgressPlugin(),
  new HtmlWebpackPlugin({
    // inlineSource: ".(css)$", // embed all javascript and css inline
    template: "index.html",
    templateParameters(compilation, assets, options) {
      return {
        compilation,
        webpack: compilation.getStats().toJson(),
        webpackConfig: compilation.options,
        htmlWebpackPlugin: {
          files: assets,
          options,
        },
        process,
      };
    },
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyCSS: true,
    },
  }),
  new CopyWebpackPlugin({
    patterns: [{ from: "./src/assets/", to: "assets/" }],
  }),
  new webpack.ProvidePlugin({
    process: "process/browser",
  }),
  new WebpackModules(),
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV:
        JSON.stringify(process.env.NODE_ENV) || JSON.stringify("development"),
      BUILD_ENV_VAL:
        JSON.stringify(process.env.BUILD_ENV_VAL) ||
        JSON.stringify("development"),
    },
  }),
];

if (analyze) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  mode: "production",
  entry: {
    bundle: path.join(dirApp, "index.js"),
  },
  plugins,

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      // This loader doesn't use a "test" so it will catch all modules
      // that fall through the other loaders.
      {
        loader: require.resolve("file-loader"),
        // Exclude `js` files to keep "css" loader working as it injects
        // its runtime that would otherwise be processed through "file" loader.
        // Also exclude `html` and `json` extensions so they get processed
        // by webpacks internal loaders.
        exclude: [/\.(js|mjs|jsx|ts|tsx|css)$/, /\.html$/, /\.json$/],
        options: {
          name: "assets/[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    modules: [dirNode, dirApp, dirAssets],
    extensions: [".jsx", ".js"],
  },
};
