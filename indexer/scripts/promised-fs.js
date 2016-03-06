import fs from 'fs'

export const readStats = path => new Promise((resolve, reject) => {
	fs.stat(path, (error, stats) => {
		if(error)
			reject(error)
		resolve(stats)
	})
})

export const readDirectory = path => new Promise((resolve, reject) => {
	fs.readdir(path, (error, files) => {
		if(error)
			reject(error)
		resolve(files)
	})
})

export const readFile = (path, encoding) => new Promise((resolve, reject) => {
	fs.readFile(path, encoding, (error, data) => {
		if(error)
			reject(error)
		resolve(data)
	})
})