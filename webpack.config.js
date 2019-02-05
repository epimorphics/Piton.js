module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  entry: ['babel-polyfill', './src/'],
  output: {
    library: 'commonjs'
  }
}
