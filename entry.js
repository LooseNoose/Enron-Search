var app = require('app'),
	BW 	= require('browser-window')


app.on('ready', function() {
	var mainWindow = new BW({
		width: 	800,
		height: 600
	})
	mainWindow.loadURL('file://' + __dirname + '/app.html')
})