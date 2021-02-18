const glob = require('glob-all')

describe('Check generated css&js files', () => {
  it('', (done) => {
    const files = glob.sync([
      './dist/index_*.js',
      './dist/index_*.css',
      './dist/search_*.js',
      './dist/search_*.css'
    ])
    console.log('----css-js-test', files)
    if (files.length > 0) {
      done()
    } else {
      throw new Error('no css&js files generated')
    }
  })
})