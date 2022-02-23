import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration, ProvidePlugin } from "webpack";
import "webpack-dev-server";

export default <Configuration>{
  devServer: {
    historyApiFallback: true,
    port: 3000,
    proxy: {
      "/api": {
        secure: false,
        changeOrigin: true,
        target: "https://d2b4wqnv2yzgzn.cloudfront.net",
      },
    },
  },
  entry: path.resolve(__dirname, "src/index.tsx"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "esbuild-loader",
        options: {
          loader: "tsx", // Or 'ts' if you don't need tsx
          target: "es2015",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
    }),
    new ProvidePlugin({
      React: "react",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
};
