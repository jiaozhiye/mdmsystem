'use strict'
const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},

    // Dev Server settings
    host: '192.168.1.111',
    port: 8080,

    // Source Maps
    devtool: 'cheap-module-eval-source-map'
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
    productionSourceMap: true,
    devtool: '#source-map'
  }
}
