'use strict'

import {
  app,
  protocol,
  BrowserWindow,
  remote,
  ipcMain,
  shell
} from 'electron'
import * as path from 'path'
import * as fs from 'fs' // API for interacting with the file system in a manner closely modeled around standard POSIX functions.
import {
  format as formatUrl
} from 'url'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import {
  isPrimitive
} from 'util';
const os = require('os') // operating system-related utility methods. We use this to create a temporary location to store the pdf file.




const isDevelopment = process.env.NODE_ENV !== 'production'

//=======================Stuff for pdf export===================

// const ipc = electron.ipcMain
// const shell = electron.shell // functions related to desktop integration.




//=======================Stuff for pdf export===================






// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], {
  secure: true
})

function createMainWindow() {
  const window = new BrowserWindow({
    darkTheme: true,
    webPreferences: {
      webSecurity: false
    }
  })

  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) window.webContents.openDevTools()
  } else {
    createProtocol('app')
    //   Load the index.html when not in development
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    )
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools()
  }
  mainWindow = createMainWindow()
})


//=======================Stuff for pdf export===============

ipcMain.on('print-to-pdf', event => {
  const pdfPath = path.join(os.tmpdir(), 'monthly-report.pdf');
  const win = BrowserWindow.fromWebContents(event.sender);

  win.webContents.printToPDF({}, (error, data) => {
    if (error) return console.log(error.message);

    fs.writeFile(pdfPath, data, err => {
      if (err) return console.log(err.message);
      shell.openExternal('file://' + pdfPath);
      event.sender.send('wrote-pdf', pdfPath)
    })
  })
})



//=======================Stuff for pdf export===================