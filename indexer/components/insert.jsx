import React from 'react'

export default class Insert extends React.Component {
  	render() {
	    return <form onSubmit={this.props.onInsert}>
			<input name="dir" type="text" placeholder='Insert directory path'/>
			<input type="submit" value="Save"/>
		</form>
	}
}