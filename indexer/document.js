import React 	from 'react'
import ReactDOM from 'react-dom'
import Indexer 	from './containers/indexer.jsx'

window.onload = function(){
  ReactDOM.render(<Indexer/>, document.getElementById('app'))
}