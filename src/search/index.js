import './search.less'

import React from 'react'
import ReactDom from 'react-dom'
import {common} from '../../common'
import { a } from './tree-shaking'
import { getURLParam } from '../../common/utils'
console.log(a())
console.log(common())
console.log(getURLParam())
// import Text from './text'

class Search extends React.Component {
  constructor () {
    super(...arguments)
    this.state = {
      Text: null
    }
  }
  
  loadComponent () {
    import('./text.js').then(Text => {
      this.setState({
        Text: Text.default
      })
    })
    // this.setState({
    //   Text: Text
    // })
  }
  render () {
    const { Text } = this.state
    return <div onClick={this.loadComponent.bind(this)}>
      { Text ? <Text></Text> : null }
      Search Text
    </div>
  }
}
ReactDom.render(
  <Search></Search>,
  document.getElementById('root')
)
