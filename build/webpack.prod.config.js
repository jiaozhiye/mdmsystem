const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.base.config')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const resolve = function (relatedPath){
    return path.join(__dirname, relatedPath)
}

const webpackConfigProd = {
    entry: {
        vendor: [ // vender 属性用于提取和打包第三方js库，并把这些库文件打包到一个js文件中
            'jquery', 'lodash',
            'vue', 'vuex', 'vue-router',
            'axios', 'element-ui', 'vee-validate', 'moment'
        ]
    },
    output: {
        filename: '[name].[chunkhash].min.js'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                extractCSS: true
            }
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
            })
        }]
    },
    devtool: '#source-map',
    plugins: [
        new ExtractTextPlugin({
            filename: 'style.[chunkhash].min.css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('../index.html'),
            // 指定生成的 html 所引用的 js 文件
            chunks: ['main', 'vendor', 'manifest'],
            hash: true
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: resolve('../login.html'),
            // 指定生成的 html 所引用的 js 文件
            chunks: ['login', 'vendor', 'manifest'],
            hash: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new CleanWebpackPlugin(['dist'], {
            root: resolve('../') // 一个根的 绝对路径
        })
    ]
}

module.exports = merge(webpackConfigBase, webpackConfigProd)