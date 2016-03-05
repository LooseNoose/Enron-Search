import React from 'react'

export default class Controls extends React.Component {
  	render() {
	    return <div>
			<button onClick={this.props.onStart}>Start Indexing</button>
			<button onClick={this.props.onClear}>Clear Directories</button>
			<button onClick={this.props.onRefresh}>Refresh</button>
	    </div>
  	}
}