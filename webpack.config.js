const path = require('path')
const pkg = require('./package.json')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: [pkg.main, pkg.style],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {importLoaders: 1}
            },
            'postcss-loader'
          ]
        })
      },
      { test: /\.svg/,
        use: 'svg-url-loader'
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('index.css'),
  ]
}