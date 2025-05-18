const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
        resolve: {
          extensions: [".js", ".jsx"],
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          publicPath: "/static/frontend/webpack_output",
          name: "[name].[ext]", // Keep original filename instead of content hash
        },
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false, // This prevents css-loader from processing URLs
              import: true,
            }
          }
        ],
      },
    ],
  },
  resolve: {
    alias: {
      Actions: path.resolve(__dirname, "./src/actions"),
      Common: path.resolve(__dirname, "./src/components/common"),
      Media: path.resolve(__dirname, "./src/media"),
      Styles$: path.resolve(__dirname, "./src/components/common/styles.jsx"),
      Test: path.resolve(__dirname, "./src/test"),
    },
  },
  entry: "./src/index.jsx",
  output: {
    filename: "main_v3.2.4.js",
    path: path.resolve(__dirname, "static", "frontend", "webpack_output"),
  },
};
