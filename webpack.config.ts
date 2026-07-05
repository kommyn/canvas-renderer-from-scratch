import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Environment = Record<string, any>;
type Arguments = Record<string, any>;

export default (_: Environment, argv: Arguments) => {
  const mode = argv.mode;
  const devMode = mode === "development";

  return {
    mode,
    entry: "./src/index.ts",
    context: __dirname,
    resolve: {
      extensions: [".ts", ".js"],
      tsconfig: true,
    },
    optimization: {
      minimizer: [`...`, new CssMinimizerPlugin()],
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      chunkFilename: "[name].[contenthash].js",
    },
    module: {
      rules: [
        {
          test: /\.js$/i,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "> 0.25%, not dead",
                    debug: true,
                  },
                ],
              ],
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
        },
        {
          test: /\.ts$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      targets: "> 0.25%, not dead",
                      debug: true,
                    },
                  ],
                ],
                plugins: ["@babel/plugin-transform-runtime"],
              },
            },
            "ts-loader",
          ],
        },
        {
          test: /\.module.css$/i,
          exclude: /node_modules/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  namedExport: false,
                },
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          exclude: /\.(?:module.css|node_modules)/i,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      new MiniCssExtractPlugin(),
    ],
  };
};

// , ['babel-plugin-polyfill-corejs3', { method: 'usage-global' }]
