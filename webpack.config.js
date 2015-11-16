var path = require('path');
var webpack = require('webpack');
var Clean = require('clean-webpack-plugin');

var filename = 'level-selector.js'
var devtool = ''
var plugins = [
  new webpack.DefinePlugin({
    VERSION: JSON.stringify(require('./package.json').version)
  })
];
if (process.env.npm_lifecycle_event === 'release') {
  filename = 'level-selector.min.js'
  devtool = 'source-map'
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {warnings: false},
    output: {comments: false}
  }));
} else {
  plugins.push(new Clean(['dist']));
}

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  devtool: devtool,
  plugins: plugins,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        }
      },
      {
        test: /\.scss$/,
        loaders: ['css', 'sass?includePaths[]='
            + path.resolve(__dirname, './node_modules/compass-mixins/lib')
            + '&includePaths[]='
            + path.resolve(__dirname, './node_modules/clappr/src/base/scss')
            + '&includePaths[]='
            + path.resolve(__dirname, './src/base/scss')
        ],
        include: path.resolve(__dirname, 'src'),
      },
       {
           test: /\.(png|woff|eot|ttf|swf)/, loader: 'url-loader?limit=1'
       },
       {
           test: /\.svg/, loader: 'svg-inline'
       },
       {
           test: /\.html/, loader: 'html?minimize=true'
       }
    ],
    resolve: {
      root: path.resolve(__dirname, 'src'),
      extensions: ['', '.js'],
    },
  },
  externals: {
    "Clappr": "Clappr",
    "clappr-zepto": "clappr-zepto"
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '<%=baseUrl%>/',
    filename: filename,
    library: 'LevelSelector',
    libraryTarget: 'umd',
  },
};
