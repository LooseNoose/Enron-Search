import React 	from 'react'
import List 	from '../components/list.jsx'
import Insert 	from '../components/insert.jsx'
import Controls from '../components/controls.jsx'

import {
	connectDatabase,
	addDirectory,
	getDirectories,
	clearDirectories,
	getDirectoryFiles,
	isDirectory,
	setDirectoryIndexed,
	getFileWords,
	wordsToTerms
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

		connectDatabase().then(this.onRefresh)
	}

	async onInsert(e) {
		e.preventDefault()

		const 	{ dir } = e.target,
				isDir = await isDirectory(dir.value)

		if(isDir) {
			await addDirectory(dir.value)

			dir.value = ''
		}

		this.onRefresh()
	}

	async onStart() {
		const dirs = await getDirectories()
	
		for(let dir of dirs) {
			if(dir.indexed)
				return

			const files = await getDirectoryFiles(dir.path)

			for(let file of files) {
				const 	words = await getFileWords(file),
						terms = wordsToTerms(words, file, dir._id)
				
				console.log(terms)
				//do something with terms... :)
			}
			await setDirectoryIndexed(dir._id)
		}

		this.onRefresh()
	}

	async onClear() {
		await clearDirectories()

		this.onRefresh()
	}

	async onRefresh() {
		const dirs = await getDirectories()

		this.setState({dirs})
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