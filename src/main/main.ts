import {app, BrowserWindow, contextBridge, ipcMain, ipcRenderer, session} from 'electron';
import {join} from 'path';
import global from "./global";
import HANDLERS from "./preload";
import {db} from "./db";


function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1540,
    height: 920,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      // webviewTag: true,
    },
    autoHideMenuBar: true,
  });
  mainWindow.removeMenu()

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(async () => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  await prepareHandlers()
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})

async function prepareHandlers() {
  for (let functionName of HANDLERS) {
    let funcInfo = functionName.match(/(\w+):(\w+)/);
    if (funcInfo) {
      let func = await import(`./handlers/${funcInfo[1]}/${funcInfo[2]}`);
      ipcMain.handle(functionName, func.default)
    }

  }
}