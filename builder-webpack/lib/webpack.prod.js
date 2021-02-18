const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

const prodConfig = {
  optimization: {
    minimize: true, // 开启自定义压缩，webpack内置的js压缩将不开启，需手动添加
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin() // 压缩js
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
        vendors: { // 分离第三方库
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: -10
        },
        utils: { // 分离特定文件
          test: /common\/utils\.js$/,
          name: 'utils',
          chunks: 'initial',
          priority: -9
        }
      }
    }
  },
  plugins: [
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
    //       global: 'React',
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
    //       global: 'ReactDOM',
    //     }
    //   ],
    // }),
  ],
  mode: 'production',
  stats: 'errors-only'
}

module.exports = merge(baseConfig, prodConfig)