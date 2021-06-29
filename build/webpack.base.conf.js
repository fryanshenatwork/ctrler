const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')

const _path = {
  main: path.resolve(__dirname, '../'),
  build: path.resolve(__dirname, '../build/'),
  dist: path.resolve(__dirname, '../dist/'),
  src: path.resolve(__dirname, '../src/'),
  buildAssets: 'assets/',
  publicPath: {
    development: '',
    production: './'
  }
}


const baseWebpackConfig = function (process) {
  templates = require('./templates')(_path, process)
  return {
    context: _path.main,
    entry: {
      main: [
        './src/main.js'
      ]
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader'
            },
            {
              loader: 'eslint-loader',
              options: {
                fix: true,
                emitWarning: true
              }
            }
          ]
        },
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: [
                  ['@babel/transform-runtime']
                ]
              }
            },
            {
              loader: 'eslint-loader',
              options: {
                fix: true,
                emitWarning: true
              }
            }
          ]
        },
        {
          test: /\.(scss|sass)$/,
          exclude: /node_modules/,
          use: [
            'css-hot-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: process.env.NODE_ENV === 'production'
          ? _path.buildAssets + '[name].[hash].css'
          : _path.buildAssets + 'bundle.css'
      }),
      new webpack.ProvidePlugin({
        '$': 'jquery',
        'jquery': 'jquery',
        'jQuery': 'jquery',
        'Popper': 'popper.js',
        'popper.js': 'popper.js'
      }),
      new StylelintPlugin({
        fix: true
      }),
      new webpack.EnvironmentPlugin({
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ].concat(templates),
    output: {
      path: _path.dist,
      filename: process.env.NODE_ENV === 'production'
        ? _path.buildAssets + '[name].[hash].js'
        : _path.buildAssets + 'bundle.js',
      publicPath: process.env.NODE_ENV === 'production'
      ? './'
      : '/'
    },
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '/@': _path.src
      }
    },
    stats: 'errors-only'
  }
}

module.exports = { baseWebpackConfig, _path }
