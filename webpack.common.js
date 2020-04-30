const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    app: './src/main.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    new CopyWebpackPlugin([{
        from: __dirname + '/public',
        to: __dirname + '/dist',
        ignore: ['.*']
    }])
  ],
  module: {
    rules: [
        { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] },
        { test: /\.js$/, exclude: /node_modules/, use: "babel-loader" },
        { test: /\.css$/, use: [ 'style-loader', 'css-loader', 'postcss-loader' ] }
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};