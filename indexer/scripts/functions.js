import fs from 'fs'
import db from 'mongodb'

const 	MONGO_URL 		= 'mongodb://localhost:27017/enron-email-project',
		FILE_ENCODING 	= 'utf8',
		WORD_REGEX 		= /\w{2,20}/ig

let 	DB_INSTANCE		= undefined



const 	initDBConnection = callback => {
			db.MongoClient.connect(MONGO_URL, (error, instance) => {
				if(error)
					return alert(error)

				DB_INSTANCE = instance

				callback()
			})
		},
		addDirectory = (path, callback) => {
			DB_INSTANCE
				.collection('dirs')
				.insert({path, indexed:false}, (error, rows) => callback(error, rows))
		},
		getDirectories = callback => {
			DB_INSTANCE
				.collection('dirs')
				.find({})
				.toArray((error, directories) => callback(error, directories))
		},
		clearDirectories = callback => {
			DB_INSTANCE
				.collection('dirs')
				.deleteMany((error, rows) => {
					callback(error, rows)
				})
		},
		getDirectoryFiles = (path, callback) => {
			fs.readdir(path, (error, items) => {
				if(error)
					return console.log(error)

				let 	local 		= [],
						iterated	= 0

				items.forEach(item => {
					const itemPath = `${path}/${item}`

					fs.stat(itemPath, (error, stats) => {
						if(error)
							return console.log(error)

						if(stats.isFile()) {
							local.push(itemPath)
							iterated++

							if(iterated === items.length)
								callback(local)
						}
						else if(stats.isDirectory()) {
							getDirectoryFiles(itemPath, filePaths => {
								local = local.concat(filePaths)
								iterated++

								if(iterated === items.length)
									callback(local)
							})
						}
						else {
							console.log('error - neither file nor directory', itemPath)
							iterated++

							if(iterated === items.length)
								callback(local)
						}
					})
				})
			})
		},
		isDirectory = (path, callback) => {
			fs.stat(path, (error, stats) => {
				callback(error, stats && stats.isDirectory())
			})
		},
		setDirectoryIndexed = _id => {
			DB_INSTANCE
				.collection('dirs')
				.updateOne({_id}, {$set:{indexed:true}})
		},
		getFileWords = (path, callback) => {

			fs.readFile(path, FILE_ENCODING, (error, data) => callback(error, data.match(WORD_REGEX)))
		},
		addWords = (words, path, id, callback) => {
			const termHash = {}

			terms = words
						.filter(word => termHash.hasOwnProperty(word) ? false : (termHash[word] = true))
						.map(word => ({directory:id, file:path, word}))

			console.log(terms) // <-- SO FAR SO GOOD...
			callback()
		}
		

export {
	addWords,
	isDirectory,
	getFileWords, 
	addDirectory, 
	getDirectories, 
	initDBConnection,
	clearDirectories, 
	getDirectoryFiles, 
	setDirectoryIndexed
}