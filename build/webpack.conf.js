'use strict'
const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},

    // Dev Server settings
    host: '127.0.0.1',
    port: 8080,

    // Source Maps
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },

  build: {
    // Template
    index: path.resolve(__dirname, '../dist/index.html'),
    login: path.resolve(__dirname, '../dist/login.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    // Source Maps
    productionSourceMap: false,
    devtool: '#source-map'
  }
}
