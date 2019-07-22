const webpack = require('webpack');
const path = require('path');
const glob = require('glob-all');
const TerserPlugin = require('terser-webpack-plugin'); // 混淆压缩js
const PurifycssPlugin = require('purifycss-webpack'); // 消除无用的css
// const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 用于压缩css代码
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin'); // 用于提取css到文件中
const copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: '#source-map', // 线上生成配置
  optimization: {
    // usedExports: true, // js Tree Shaking
    // webpack4中废弃了webpack.optimize.CommonsChunkPlugin插件,用新的配置项替代,把多次import的文件打包成一个单独的common.js
    splitChunks: {
      cacheGroups: {
        commons: { // 抽离自己写的公共代码
          chunks: "initial",
          name: "common", // 打包后的文件名，任意命名
          minChunks: 2, //最小引用2次
          minSize: 0 // 只要超出0字节就生成一个新包
        },
        vendor: { // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 2,
          name: 'vendor', // 打包后的文件名，任意命名
          priority: 10 // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        exclude: /\/node_modules/,
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }),
      // new OptimizeCssAssetsPlugin({
      //   assetNameRegExp: /\.optimize\.css$/g,
      //   cssProcessor: require('cssnano'),
      //   cssProcessorPluginOptions: {
      //     preset: ['default', {
      //       discardComments: {
      //         removeAll: true
      //       }
      //     }],
      //   },
      //   canPrint: true
      // }),
      // new UglifyjsWebpackPlugin({
      //   uglifyOptions: {
      //     warnings: false,
      //     parse: {},
      //     compress: {
      //       drop_console: true,
      //       drop_debugger: true
      //     },
      //     mangle: true, // Note `mangle.properties` is `false` by default.
      //     output: null,
      //     toplevel: false,
      //     nameCache: null,
      //     ie8: false,
      //     keep_fnames: false,
      //   },
      // }),
    ]
  },
  plugins: [
    // 消除无用的css
    new PurifycssPlugin({
      paths: glob.sync([
        path.join(__dirname, './src/*.html'),
        path.resolve(__dirname, './src/*.js')
      ])
    }),
    new copyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'), //要打包的静态资源目录地址，这里的__dirname是指项目目录下，是node的一种语法，可以直接定位到本机的项目目录中
      to: './static', //要打包到的文件夹路径，跟随output配置中的目录。所以不需要再自己加__dirname
    }]),
    // new MiniCssExtractPlugin({
    //   // Options similar to the same options in webpackOptions.output
    //   // all options are optional
    //   filename: '[name].[hash:20].css',
    //   chunkFilename: '[id].[hash:20].css',
    //   // ignoreOrder: false, // Enable to remove warnings about conflicting order
    // }),
    // new OptimizeCssnanoPlugin({
    //   sourceMap: true,
    //   cssnanoOptions: {
    //     preset: [
    //       'default',
    //       {
    //         mergeLonghand: false,
    //         cssDeclarationSorter: false
    //       }
    //     ]
    //   }
    // }),
  ]
}