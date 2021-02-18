const { webpack } = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const devConfig = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './dist', // WDS服务的基础目录
    hot: true,
    stats: 'errors-only'
  },
  mode: 'development',
  devtool: 'source-map'
}

module.exports = merge(baseConfig, devConfig)