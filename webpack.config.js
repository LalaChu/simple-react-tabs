const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {test: /\.jsx?$/, exclude: /node_modules/, use:["babel-loader" ,"eslint-loader"]},
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer:{
    hot: true,
    inline: true,
    contentBase:  path.join(__dirname, "dist"),
  }
};
