const path = require('path')
// const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
// const FriendlyErrorPlugin = require('friendly-errors-webpack-plugin') // 错误提示插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const glob = require('glob')

// const smp = new SpeedMeasurePlugin()

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
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          // {
          //   loader: 'thread-loader', // 多进程打包
          //   options:{
          //     workers: 3
          //   }
          // },
          'babel-loader'
        ]
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
  optimization: {
    minimize: true, // 开启自定义压缩，webpack内置的js压缩将不开启，需手动添加
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin() // 压缩js, parallel开启并行压缩
    ],
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: { // 分离公共库
          name: 'commons', // 公共库的名字
          chunks: 'all',
          minChunks: 2, // 引用2次及以上分离
          priority: -20 // 优先级，同时命中多个chacheGroups缓存组时执行
        },
        // vendors: { // 分离第三方库
        //   test: /[\\/]node_modules[\\/]/,
        //   name: 'vendor',
        //   chunks: 'all',
        //   priority: -10
        // },
        utils: { // TODO 分离特定文件
          test: /common\/utils\.js$/,
          name: 'utils',
          chunks: 'initial',
          priority: -9
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({ // 抽离css，与style-loader互斥
       filename: '[name]_[contenthash:8].css'
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
          global: 'ReactDOM',
        }
      ],
    }),
    new CleanWebpackPlugin(), // 清除构建目录，默认为output的path
    // new FriendlyErrorPlugin(),
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
  mode: 'production',
  // stats: 'errors-only'
}