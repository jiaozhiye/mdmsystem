const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = function (relatedPath){
    return path.join(__dirname, relatedPath)
}

const webpackConfigBase = {
    entry: {
        main: resolve('../src/main.js'),
        login: resolve('../src/login.js')
    },
    output: {
        path: resolve('../dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
                options: {
                    presets: ['es2015', 'stage-0']
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'components': resolve('../src/components'),
            'store': resolve('../src/store'),
            'common': resolve('../src/common'),
            'assets': resolve('../src/assets'),
            'api': resolve('../src/api')
        },
        extensions: ['.js', '.vue', '.json']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('../index.html'),
            chunks: ['main'],
            hash: true
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: resolve('../login.html'),
            chunks: ['login'],
            hash: true
        }),
        new CopyWebpackPlugin([{
            from: resolve('../src/assets'), // 拷贝静态资源到 dist 目录
            to: resolve('../dist'),
            flatten: true // 只拷贝文件不拷贝文件夹
        }])
    ]
}

module.exports = webpackConfigBase