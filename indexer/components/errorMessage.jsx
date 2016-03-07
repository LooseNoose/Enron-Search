import React from 'react'

export default class ErrorMessage extends React.Component {
  	render() {
	    return <p onClick={this.props.onClear} disabled={this.props.isIndexing}>
	    	{this.props.error ? this.props.error.message : ''}
	    </p>
  	}
}