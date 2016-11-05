var webpack = require('webpack'),
    // 使用插件将组件中相同部分抽成一个单独文件
    CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"),
    // JS压缩插件
    uglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
    path = require('path');

module.exports = {
  entry: {
    'musicBundle': [
      './public/scripts/components/music/music_index'      // 引入音乐首页JS脚本
    ],
    'gallery': [
      './public/scripts/components/music/gallery'      // 引入音乐广告JS脚本
    ]
  },
  output: {
    path: path.join(__dirname, '/public/libs/scripts/components/'),  // 输出JS路径
    publicPath:  'http://localhost:1234/libs/scripts/components/', //服务器上查找路径
    filename: '[name].min.js'
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,                           // 对ES6和React进行转换
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
      {
        test: /\.json$/,
        loader:'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']           // 识别文件后缀名
  },
  plugins: [
    // 使用插件将组件中相同部分抽成一个单独文件
    new CommonsChunkPlugin('componentInit.min.js', ['musicBundle']),
    // JS代码压缩
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
