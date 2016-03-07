import React from 'react'

export default class Insert extends React.Component {
  	render() {
	    return <form onSubmit={this.props.onInsert} disabled={this.props.isIndexing}>
			<input name='dir' type='text' placeholder='Insert directory path' disabled={this.props.isIndexing}/>
			<input type='submit' value='Save' disabled={this.props.isIndexing}/>
		</form>
	}
}