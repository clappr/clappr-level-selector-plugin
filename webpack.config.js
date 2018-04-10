var path = require('path');
var webpack = require('webpack');
var filename = 'level-selector.js'

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  externals: {
    "Clappr": "Clappr",
    "clappr-zepto": "clappr-zepto"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader?singleton=true', 'css-loader', 'postcss-loader', 'sass-loader?includePaths[]='
          + path.resolve(__dirname, './node_modules/compass-mixins/lib')
          + '&includePaths[]='
          + path.resolve(__dirname, './node_modules/clappr/src/base/scss')
          + '&includePaths[]='
          + path.resolve(__dirname, './src/base/scss')
        ],
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.html/, loader: 'html-loader?minimize=false'
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '<%=baseUrl%>/',
    filename: filename,
    library: 'LevelSelector',
    libraryTarget: 'umd',
  },
  devServer: {
    contentBase: 'public/',
    host: '0.0.0.0',
    disableHostCheck: true,
    inline: false
  }
};
