var fs 			= require('fs'),
	$			= require('jQuery'),
	dbClient 	= require('mongodb').MongoClient,

	addDir		= function(path) {
		db.collection("dirs").insert({path : path})
	},

	db 			= undefined

dbClient.connect('mongodb://localhost:27017/enron-search', function(error, instance) {
	if(error)
		alert(error)
	else 
		db = instance
})

	

$('#insert-dir').submit(function(e) {
	e.preventDefault()

	fs.stat(e.target.dir.value, function(error, stats){
		if(error) {
			alert(error)
		}
		else if(stats && stats.isDirectory()) {
			addDir(e.target.dir.value)
		}
		else {
			alert("string fuck you")
		}
		e.target.dir.value = ''
	})
})

$('#start').click(function(e) {
	e.preventDefault()

	//index dir filer
})

$('#clear').click(function(e) {
	e.preventDefault()

	//ryd alt i DB'en af dirs

	$('#dirs').empty()
})

/*
var contents = fs.readFile('./maildir/allen-p/_sent_mail/1', function(error, data) {
	document.write(error ? error : data)
})
*/