const path = require('path')
const babelConfig = require('../babel.config')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'demo.ts'),
  output: {
    path: path.resolve(__dirname),
    filename: 'demo.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.[t,j]s$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: babelConfig
        }
      }
    ]
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.ts']
  }
}
