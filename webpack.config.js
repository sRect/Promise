const webpack = require('webpack');
const merge = require('webpack-merge');
const _mode = process.env.NODE_ENV;
console.log("==========================", _mode)
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
const _webpackBaseConfig = require(`./config/webpack.base.js`);

module.exports = merge(_webpackBaseConfig, _mergeConfig);
