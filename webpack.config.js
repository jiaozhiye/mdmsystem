var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: './src/main.js',
    login: './src/login.js',
    vendor: [ // vender 属性用于提取和打包第三方js库，并把这些库文件打包到一个js文件中
      'jquery', 'lodash', 
      'vue', 'vuex', 'vue-router', 
      'axios', 'vee-validate', 'element-ui'
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    filename: '[name].min.js' // 开发环境
    // filename: '[name].[chunkhash].min.js' // 生产环境
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {}
          // other vue-loader options go here
        }
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
        test: /\.css$/,
        use: [
					{loader: 'style-loader'},
					{
						loader: 'css-loader',
						options: {
							minimize: true
						}
					}
				]
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
      'components': path.resolve(__dirname, './src/components'),
      'common': path.resolve(__dirname, './src/common'),
      'assets': path.resolve(__dirname, './src/assets'),
      'store': path.resolve(__dirname, './src/store'),
      'api': path.resolve(__dirname, './src/api')
    },
    extensions: ['.js', '.vue', '.json']
  },
  devServer: {
    host: '192.168.1.103',
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production'){
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
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
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['main', 'vendor', 'manifest'], // 指定生成的 html 所引用的 js 文件
      hash : true
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: './login.html',
      chunks: ['login', 'vendor', 'manifest'],
      hash : true
    }),
	  new CopyWebpackPlugin([{
      from: path.join(__dirname, 'src/assets'),
      to: path.join(__dirname, 'dist')
    }])
  ])
}
