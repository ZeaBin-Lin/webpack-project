const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorPlugin = require('friendly-errors-webpack-plugin') // 错误提示插件
const glob = require('glob')

function setMPA () {
  let entry = {}
  let htmlwebpackPlugin = []
  
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js')) // 同步读取
  // [ '/Users/zed/Documents/code/private/jeek/webpack/src/index/index.js',
  // '/Users/zed/Documents/code/private/jeek/webpack/src/search/index.js' ]
  Object.keys(entryFiles).forEach(idx => {
    let file = entryFiles[idx]
    let pageNameReg = /src\/(.*)\/index.js/
    let match = file.match(pageNameReg)
    let pageName = match && match[1]
    entry[pageName] = file

    htmlwebpackPlugin.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,  
          removeComments: false
        }
      }),
    )
  })
  
  return {
    entry,
    htmlwebpackPlugin
  }
}

const { entry, htmlwebpackPlugin } = setMPA()

module.exports = {
  entry,
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        use: [ // loader从右到左执行
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|bmp)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new FriendlyErrorPlugin()
  ].concat(htmlwebpackPlugin),
  devServer: {
    contentBase: './dist', // WDS服务的基础目录
    hot: true,
    stats: 'errors-only'
  },
  mode: 'development',
  devtool: 'source-map'
}