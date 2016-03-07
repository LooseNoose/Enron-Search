import db from 'mongodb'
import { readStats, readDirectory, readFile } from './promised-fs'

const 	MONGO_URL 				= 'mongodb://localhost:27017/enron-email-project',
		DIRECTORY_COLLECTION 	= 'directories',
		FILE_ENCODING 			= 'utf8',
		WORD_REGEX 				= /\w{2,20}/ig

let 	DB_INSTANCE				= undefined

export const connectDatabase = async function() {
	DB_INSTANCE = await db.MongoClient.connect(MONGO_URL)
}

export const addDirectory = async function(path) {
	return await DB_INSTANCE
		.collection(DIRECTORY_COLLECTION)
		.insert({path, indexed:false})
}

export const getDirectories = async function() {
	return await DB_INSTANCE
		.collection(DIRECTORY_COLLECTION)
		.find({})
		.toArray()
}

export const clearDirectories = async function() {
	return await DB_INSTANCE
		.collection(DIRECTORY_COLLECTION)
		.deleteMany()
}

export const getDirectoryFiles = async function(path) {
	const files = await readDirectory(path)
	let local 	   = []

	for(let file of files) {
		const 	filePath = `${path}/${file}`,
				fileStats = await readStats(filePath)

		if(fileStats.isFile()) {
			local.push(filePath)
		}
		else if(fileStats.isDirectory()) {
			const nested = await getDirectoryFiles(filePath)
			local = local.concat(nested)
		}
		else {
			console.error(`ERROR - neither directory nor path at ${filePath}`)
		}
	}
	
	return local
}

export const isDirectory = async function(path) {
	const fileStats = await readStats(path)
	return fileStats.isDirectory()
}

export const setDirectoryIndexed = async function(_id) {
	return await DB_INSTANCE
		.collection(DIRECTORY_COLLECTION)
		.updateOne({_id}, {$set:{indexed:true}})
}

export const getFileWords = async function(path) {
	const content = await readFile(path, FILE_ENCODING)
	return content.match(WORD_REGEX)
}

export const wordsToTerms = function(words, path, id) {
	const 	termHash 	= {},
			terms 		= words
							.filter(word => termHash.hasOwnProperty(word) ? false : (termHash[word] = true))
							.map(word => ({directory:id, file:path, term:word}))
}