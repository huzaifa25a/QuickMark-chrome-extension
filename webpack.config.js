import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

export default {
  entry: {
    popup: "./src/popup/index.jsx", // Ensure it points to the correct entry file
  },
  output: {
    filename: "[name].js",
    path: path.resolve("build"), // Correct output path
    clean: true,
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // Support both JS & TS
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/popup/popup.html",
      filename: "popup.html",
      chunks: ["popup"],
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/manifest.json", to: "manifest.json" }, // Copy manifest.json
        { from: "src/assets", to: "assets" }, // Copy assets folder
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  devtool: "cheap-module-source-map",
};
