import React from 'react'

export default class List extends React.Component {
  	render() {
    	return <ul>
			{this.props.dirs.map(dir => <li key={dir._id}>[{dir.indexed ? 'x' : ' '}] { dir.path}</li> )}
		</ul>
  	}
}