import app 				from 'app'
import BrowserWindow 	from 'browser-window'

let mainWindow = undefined

app.on('window-all-closed', () => {
    app.quit()
})

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 400, height: 300})
  mainWindow.loadURL(`file://${__dirname}/document.html`)
  mainWindow.on('closed', () => {
    mainWindow = undefined
  })
})