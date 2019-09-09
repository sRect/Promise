const webpack = require('webpack');
const path = require('path');
const glob = require('glob-all');
const TerserPlugin = require('terser-webpack-plugin'); // 混淆压缩js
const PurifycssPlugin = require('purifycss-webpack'); // 消除无用的css
// const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 用于压缩css代码
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  // devtool: '#source-map', // 线上生成配置
  optimization: {
    runtimeChunk: { // 去除相同的webpack的运行文件，减少文件体积
      name: "manifest"
    },
    occurrenceOrder: true, // To keep filename consistent between different modes (for example building only)
    // usedExports: true, // js Tree Shaking
    // webpack4中废弃了webpack.optimize.CommonsChunkPlugin插件,用新的配置项替代,把多次import的文件打包成一个单独的common.js
    splitChunks: {
      chunks: "all", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async) https://juejin.im/post/5af1677c6fb9a07ab508dabb
      minSize: 30000, // 最小尺寸，30000
      minChunks: 1, // 最小 chunk ，默认1
      maxAsyncRequests: 5, // 最大异步请求数， 默认5
      maxInitialRequests: 3, // 最大初始化请求数，默认3
      automaticNameDelimiter: '~',// 打包分隔符
      cacheGroups: {
        commons: { // 抽离自己写的公共代码
          chunks: "initial", 
          // name: "common", // 打包后的文件名，任意命名
          minChunks: 2, //最小引用2次
          maxInitialRequests: 5,
          minSize: 0 // 只要超出0字节就生成一个新包
        },
        vendor: { // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 2,
          name: 'vendor', // 打包后的文件名，任意命名
          priority: 10, // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          enforce: true
        }
        // 'vendor-pageA': {
        //   test: /tween/, // 直接使用 test 来做路径匹配
        //   chunks: "initial",
        //   name: "vendor-pageA",
        //   enforce: true,
        // },
        // 'vendor-pageB': {
        //   test: /moment/, // 直接使用 test 来做路径匹配
        //   chunks: "initial",
        //   name: "vendor-pageB",
        //   enforce: true,
        // }
      }
    },
    minimizer: [
      // https://blog.csdn.net/qq_22267353/article/details/53463802
      // https://www.npmjs.com/package/terser-webpack-plugin
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        exclude: /node_modules/,
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
          mangle: true, // true/false 是否混淆变量名
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
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          safe: true,
          discardComments: {
            removeAll: true
          }
        }
      })
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
    // new MiniCssExtractPlugin({
    //   // Options similar to the same options in webpackOptions.output
    //   // all options are optional
    //   filename: '[name].[hash:20].css',
    //   chunkFilename: '[id].[hash:20].css',
    //   // ignoreOrder: false, // Enable to remove warnings about conflicting order
    // }),
  ]
}