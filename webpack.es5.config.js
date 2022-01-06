const path = require('path')
const babelConfig = require('./babel.config')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.min.js',
    libraryTarget: 'umd'
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
    extensions: ['.js', '.json', '.ts']
  }
  // plugins: [new BundleAnalyzerPlugin()]
}
