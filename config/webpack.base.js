const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin'); // 打包html
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'); // 分离css
// const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 用于压缩css代码
// const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin'); // 混淆压缩js
// const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  // devtool: 'inline-source-map',
  // entry: './src/index.js',
  // entry: ['./src/index.js'], // 将两个文件打包成一个
  entry: { // 多入口
    // index: './src/index.js',
    // AOP: './src/AOP.js',
    // iterator: './src/iterator.js'
    pageA: './src/js/pageA',
    pageB: './src/js/pageB',
    pageC: './src/js/pageC'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash:20].js', // 多出口
    chunkFilename: "[name].[chunkhash].js"
  },
  mode: process.env.NODE_ENV,
  resolve: {
    // 能够使用户在引入模块时不带扩展
    extensions: ['.js', '.json', '.vue', 'css', 'less'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        // use: ['style-loader', 'css-loader'] // 从右往左
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        }),
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'less-loader'
            }
          ]
        }),
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|ttf|eot|woff(2)?)(\?[=a-z0-9]+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: 'images/',
            name: '[name]_[hash:7].[ext]'
          }
        }]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ExtractTextWebpackPlugin({
      filename: 'css/[name].[hash:20].css',
      disable: process.env.NODE_ENV === 'development' ? true : false // 是否禁用(development下禁用，因为要热更新)
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'promiseA+',
      hash: true,
      minify: {
        collapseWhitespace: true, // 折叠空行
        removeAttributeQuotes: true
      },
      template: './index.html',
      // chunks: ['index', 'AOP', 'iterator'] // index.html 引入index.js
      chunks: ['pageA', 'pageB', 'pageC']
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'a.html',
    //   title: 'hello world',
    //   hash: true,
    //   minify: {
    //     collapseWhitespace: true, // 折叠空行
    //     removeAttributeQuotes: true
    //   },
    //   template: './index.html',
    //   chunks: ['a'] // a.html引入a.js
    // }),
    new copyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'), //要打包的静态资源目录地址，这里的__dirname是指项目目录下，是node的一种语法，可以直接定位到本机的项目目录中
      to: './static', //要打包到的文件夹路径，跟随output配置中的目录。所以不需要再自己加__dirname
    }]),
    new FriendlyErrorsWebpackPlugin(),
    new WebpackBuildNotifierPlugin({
      title: "编译结果：",
      // logo: path.resolve("./img/favicon.png"),
      suppressSuccess: true
    }),
    // 暴露全局变量,引入第三方类库
    // new webpack.ProvidePlugin({
    //   $: 'jquery', // npm
    //   jQuery: 'jQuery' // 本地Js文件
    // }),
    // 指定环境, 定义环境变量
    new webpack.DefinePlugin({
      'process.env': process.env.NODE_ENV,
      'BASE_URL': '"http://api.xxx.com:8080"'
    })
  ],
  
}