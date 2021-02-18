const path = require('path')

process.chdir(path.join(__dirname, 'smoke/template'))

describe('check webpack unit', () => {
  require('./unit/webpack-base-test')
})