var webpack = require('webpack'),
    // 使用插件将组件中相同部分抽成一个单独文件
    CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"),
    // JS压缩插件
    uglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
    path = require('path');

module.exports = {
  //页面入口文件配置
  entry: {
    'musicBundle': [
      './public/scripts/components/music/music_index'     // 引人音乐首页JS脚本
    ]
  },
  //入口文件输出配置
  output: {
    path: path.join(__dirname, '/public/libs/scripts/components/'),    //输出js路径
    filename: '[name].min.js'
  },
  module: {
    //加载器配置
    loaders: [
      {
        test: /\.js[x]?$/,                      // 对ES6和React进行转换
        exclude: /node-modules/,
        loader: 'babel-loader',
        query: {
          preset: ['es2015', 'react']
        }
      }
    ]
  },
  resolve: {      //其它解决方案配置
    extensions: ['', '.js', '.jsx']             // 识别文件后缀名
  },
  plugins: [      // 插件项
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