import React 	from 'react'
import List 	from '../components/list.jsx'
import Insert 	from '../components/insert.jsx'
import Controls from '../components/controls.jsx'

import {
	addWords,
	isDirectory,
	getFileWords,
	addDirectory,
	getDirectories,
	initDBConnection, 
	clearDirectories, 
	getDirectoryFiles, 
	setDirectoryIndexed
} from '../scripts/functions'

export default class Indexer extends React.Component {
	constructor() {
		super()

		this.onInsert 	= this.onInsert.bind(this)
		this.onStart 	= this.onStart.bind(this)
		this.onClear 	= this.onClear.bind(this)
		this.onRefresh 	= this.onRefresh.bind(this)
		this.clearError = this.clearError.bind(this)

		this.state = {
			dirs: [],
			error: undefined
		}

		initDBConnection(() => {
			this.onRefresh()
		})
	}

	onInsert(e) {
		e.preventDefault()

		const { dir } = e.target
		
		isDirectory(dir.value, (error, isDir) => {
			this.setState({error})

			if(isDir)
				addDirectory(dir.value, (error, rows) => {
					this.setState({error})
					dir.value = ''

					if(rows)
						this.onRefresh()
				})
		})
	}

	onStart() {
		getDirectories((error, dirs = []) => {
			this.setState({error})
			dirs.forEach(dir => {
				if(dir.indexed)
					return
				getDirectoryFiles(dir.path, (files = []) => {
					files.forEach(file => {
						getFileWords(file, (error, words) => {
							if(error)
								return console.log(error)
							addWords(words, file, dir._id, () => {
								setDirectoryIndexed(dir._id)
							})
						})
					})
				})
			})
		})
	}

	onClear() {
		clearDirectories((error, rows) => {
			this.setState({error})

			if(rows)
				this.onRefresh()
		})
	}

	onRefresh() {
		getDirectories((error, dirs) => {
			this.setState({
				dirs: error ? this.state.dirs : dirs,
				error
			})
		})
	}

	clearError() {
		this.setState({error:undefined})
	}

  	render() {
    	return <div>
	    	<h1>Enron Email Indexer</h1>
	    	<Insert onInsert={this.onInsert}/>
	    	<Controls 
	    		onStart={this.onStart} 
	    		onClear={this.onClear} 
	    		onRefresh={this.onRefresh}
	    	/>
	    	<List dirs={this.state.dirs}/>
	    	<p onClick={this.clearError}>
	    		{this.state.error ? this.state.error.message : ''}
	    	</p>
    	</div>
  	}
}