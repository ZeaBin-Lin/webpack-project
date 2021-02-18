
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const glob = require('glob')
const path = require('path')

const projectRoot = process.cwd() // 当前执行的路径
console.log(projectRoot, __dirname)

function setMPA () {
  let entry = {}
  let htmlwebpackPlugin = []
  
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js')) // 同步读取
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
        template: path.join(projectRoot, `src/${pageName}/index.html`),
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
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name]_[chunkhash:8].js'
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
          // 'style-loader', // style-loader将样式提取添加到style标签中，与MiniCssExtractPlugin互斥
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          'postcss-loader',
          // {
          //   loader: 'px2rem-loader',
          //   options: {
          //     remUnit: 75, // rem 相对于 px转化的单位，此处75代表 1rem = 75px
          //     remPrecision: 8 // 小数点后几位
          //   }
          // }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|bmp)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash:8].[ext]' // 这里的hash是文件内容的md5
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ // 抽离css，与style-loader互斥
       filename: '[name]_[contenthash:8].css'
    }),
    new CleanWebpackPlugin(), // 清除构建目录，默认为output的path
    // new BundleAnalyzerPlugin(),
    function () {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
          console.log('build error');
          // 此处可以上报错误信息
          process.exit(1)
        }
      })
    }
  ].concat(htmlwebpackPlugin),
}