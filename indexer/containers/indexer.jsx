import React 		from 'react'
import List 		from '../components/list.jsx'
import Insert 		from '../components/insert.jsx'
import Controls 	from '../components/controls.jsx'
import ErrorMessage from '../components/errorMessage.jsx'

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
			error: undefined,
			isIndexing:false
		}
		connectDatabase().then(this.onRefresh)
	}

	async onInsert(e) {
		try {
			e.preventDefault()
			const 	{ dir } = e.target,
					isDir = await isDirectory(dir.value)
			if(isDir) {
				await addDirectory(dir.value)
				dir.value = ''
			}
			this.onRefresh()
		}
		catch(error) {
			this.setState({error})
		}
	}

	async onStart() {
		try {
			this.setState({isIndexing:true})
			const dirs = await getDirectories()
			for(let dir of dirs) {
				if(dir.indexed)
					continue
				const files = await getDirectoryFiles(dir.path)
				for(let file of files) {
					const 	words = await getFileWords(file),
							terms = wordsToTerms(words, file, dir._id)
					// do something with terms...
				}
				await setDirectoryIndexed(dir._id)
			}
			this.onRefresh()
		}
		catch(error) {
			this.setState({error})
		}
		finally {
			this.setState({isIndexing:false})
		}
	}

	async onClear() {
		try {
			await clearDirectories()
			this.onRefresh()
		}
		catch(error) {
			this.setState({error})
		}
	}

	async onRefresh() {
		try {
			const dirs = await getDirectories()
			this.setState({dirs})
		}
		catch(error) {
			this.setState({error})
		}
		
	}

	clearError() {
		this.setState({error:undefined})
	}

  	render() {
    	return <div>
	    	<h1>Enron Email Indexer</h1>
	    	<Insert 
	    		onInsert={this.onInsert} 
	    		isIndexing={this.state.isIndexing}
	    	/>
	    	<Controls 
	    		onStart={this.onStart}
	    		onClear={this.onClear}
	    		onRefresh={this.onRefresh}
	    		isIndexing={this.state.isIndexing}
	    	/>
	    	<List 
	    		dirs={this.state.dirs}
	    	/>
	    	<ErrorMessage
	    		error={this.state.error}
	    		onClear={this.clearError}
	    	/>
    	</div>
  	}
}