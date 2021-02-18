
const assert = require('assert')

describe('webpack.base.js test case', () => {
  const baseConfg = require('../../lib/webpack.base')

  console.log('---baseconfig', baseConfg)
  it('entry', () => {
    assert.equal(baseConfg.entry.index, 'H:/private/webpack/builder-webpack/test/smoke/template/src/index/index.js')
    assert.equal(baseConfg.entry.search, 'H:/private/webpack/builder-webpack/test/smoke/template/src/search/index.js')
  })
})