'use strict'
const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')

module.exports = function (_path, process) {
  const replaceKey = [
    {
      pattern: '<!-- publicPath -->',
      replacement: _path.publicPath[process.env.NODE_ENV]
    }
  ]

  const templatesPath = _path.main + '/sandbox/'
  const searchRecursive = function (dir, pattern) {
    var results = []
    fs.readdirSync(dir).forEach(function (dirInner) {
      dirInner = path.resolve(dir, dirInner)
      var stat = fs.statSync(dirInner)
      if (stat.isDirectory()) {
        results = results.concat(searchRecursive(dirInner, pattern))
      }
      if (stat.isFile() && dirInner.endsWith(pattern)) {
        results.push(dirInner)
      }
    })
    return results
  }

  const templatesPlugin = searchRecursive(templatesPath, '.html').map(e => {
    const folderSign = templatesPath.substr(0, 1)
    const e_m = e.replace(/[/]/g, folderSign)
    const templatesPath_m = templatesPath.replace(/[/]/g, folderSign)
    return new HtmlWebpackPlugin({
      template: e,
      filename: e_m.replace(templatesPath_m, ''),
      inject: true,
      minify: false
    })
  })

  const replacementPlugin = new HtmlReplaceWebpackPlugin(replaceKey)

  return []
    .concat(templatesPlugin)
    .concat(replacementPlugin)
}