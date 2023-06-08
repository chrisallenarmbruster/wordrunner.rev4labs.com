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
  mode: "development", //or production
  entry: {
    main: path.resolve(__dirname, "client/js/app.js"),
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].[contenthash].js",
    clean: true,
    // assetModuleFilename: "[name].[contenthash][ext]",
    publicPath: "./", // this tells it where to start the path for asset/resource types below
  },
  devtool: "inline-source-map",
  // devServer: {
  //   static: { directory: path.resolve(__dirname, "public") },
  //   port: 3000,
  //   compress: true,
  //   open: true,
  //   hot: true,
  //   watchFiles: [
  //     path.resolve(__dirname, "public"),
  //     path.resolve(__dirname, "client"),
  //   ],
  // },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: [
          "style-loader",
          // use plug-in below instead of "style-loader" above to produce separate css file.
          // Purgecss plugin works w/ plugin below, but style-loader does not.
          // Style-loader may be better for dev, since it works well when watching files for changes.
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     publicPath: "../", //this informs of the relative path to the "asset/resource" loaders below
          //   },
          // },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: () => [require("autoprefixer")],
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[contenthash][ext][query]",
        },
      },
      {
        test: /\.(ogg|mp3|wav)$/i,
        type: "asset/resource",
        generator: {
          filename: "audio/[name].[contenthash][ext][query]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[contenthash][ext][query]",
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
      filename: "index.html",
      template: path.resolve(__dirname, "client/index.html"),
    }),
    new MiniCssExtractPlugin({ filename: "css/style.[contenthash].css" }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
  ],
}
