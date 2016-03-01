var fs 			= require('fs'),
	$			= require('jQuery'),
	dbClient 	= require('mongodb').MongoClient,

	//insert new directories path to the DB
	addDir		= function(path) {
		db.collection("dirs").insert({path : path, indexed:false})
	},
	//gets all directories and reinsert them in the view
	getDirs		= function() {
		db.collection("dirs")
			.find({})
			.toArray(function(error, docs) {

				//stop if there's an error
				if(error)
					return console.log(error)

				//put doc elements in an array as DOM-nodes
				var elements = docs.map(function(doc) {
					return $('<li>[' + (doc.indexed ? 'x' : ' ') + '] ' + doc.path + '</li>')
				})

				$('#dirs').empty()
				$('#dirs').append(elements)
			})
	},
	recursivelyIndexDir = function(path) {
		fs.readdir(path, function(error, files) {
			if(error)
				return console.log(error)

			files.forEach(function(file) {
				var filePath = path +'/'+ file

				fs.stat(filePath, function(error, stats) {
					if(error)
						return console.log(error)

					if(stats.isFile()) {
						console.log("I'm a file!")
					}
					else if(stats.isDirectory()) {
						recursivelyIndexDir(filePath)					}
					else {
						console.log('invalid! not file nor directory')
					}
				})
			})
		})
	}


	//DB client, uninitialized
	db 			= undefined

//initialize DB client
dbClient.connect('mongodb://localhost:27017/enron-search', function(error, instance) {
	if(error)
		alert(error)
	else {
		db = instance

		getDirs()
	}
})

	
//event handler for inserting new directories
$('#insert-dir').submit(function(e) {
	e.preventDefault()

	//check if the path points at a file
	fs.stat(e.target.dir.value, function(error, stats){

		//if there is no file, alert the view
		if(error) {
			alert(error)
		}

		//if the file is a directory, call addDir and refresh the view
		else if(stats && stats.isDirectory()) {
			addDir(e.target.dir.value)
			getDirs()

		}

		//if the file is not a directory, alert the view
		else {
			alert("invalid directory")
		}

		//clear the input
		e.target.dir.value = ''
	})
})

//event handler for starting to index files
$('#start').click(function(e) {
	e.preventDefault()

	//get all directories from the DB
	db.collection("dirs")
			.find({})
			.toArray(function(error, docs) {
				if(error)
					return console.log(error)

				docs.forEach(function(doc) {

					//if the directory is indexed, skip it
					if(doc.indexed)
						return

					recursivelyIndexDir(doc.path)
				})
			})
})

//event handler for clearing all directories
$('#clear').click(function(e) {
	e.preventDefault()

	//clear directories from the DB
	db.collection("dirs")
			.deleteMany(function(error, rows) {

				//if directories were cleared, clear them from the view
				if(rows)
					$('#dirs').empty()
			})
})

//event handler for refreshing the view
$('#refresh').click(function(e) {
	e.preventDefault()

	getDirs()
})


/*
	var contents = fs.readFile('./maildir/allen-p/_sent_mail/1', function(error, data) {
		document.write(error ? error : data)
	})
*/