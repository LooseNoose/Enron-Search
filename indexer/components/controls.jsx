import React from 'react'

export default class Controls extends React.Component {
  	render() {
	    return <div>
			<button onClick={this.props.onStart} 	disabled={this.props.isIndexing}>Start Indexing</button>
			<button onClick={this.props.onClear} 	disabled={this.props.isIndexing}>Clear Directories</button>
			<button onClick={this.props.onRefresh} 	disabled={this.props.isIndexing}>Refresh</button>
	    </div>
  	}
}