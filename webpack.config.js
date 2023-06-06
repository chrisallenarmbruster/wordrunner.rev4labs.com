const path = require("path")
const glob = require("glob")
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

// for purgecss-webpack-plugin
const PATHS = {
  src: path.join(__dirname, "client"),
}

module.exports = {
  entry: "./client/js/app.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
    publicPath: "./", // this tells it where to start the path for asset/resource types below
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: [
          // "style-loader",
          // use plug-in below instead of "style-loader" above to produce separate css file
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../", //this informs of the relative path to the "asset/resource" loaders below
            },
          },
          "css-loader",
          //added for postcss processing
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: () => [require("autoprefixer")],
              },
            },
          },
          //added for sass (bootstrap needs as well)
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[hash][ext][query]",
        },
      },
      {
        test: /\.(ogg|mp3|wav)$/i,
        type: "asset/resource",
        generator: {
          filename: "audio/[hash][ext][query]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "custom template",
      template: "./client/index.html",
    }),
    new MiniCssExtractPlugin({ filename: "css/style.css" }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
  ],
}
