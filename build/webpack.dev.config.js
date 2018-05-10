const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.base.config')

const webpackConfigDev = {
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader',
                    options: {
                        minimize: true
                    }
                }
            ]
        }]
    },
    devServer: {
        host: '192.168.1.109',
        historyApiFallback: true,
        noInfo: true,
        hot: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

module.exports = merge(webpackConfigBase, webpackConfigDev)