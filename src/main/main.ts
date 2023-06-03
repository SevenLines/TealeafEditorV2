import {app, BrowserWindow, contextBridge, ipcMain, ipcRenderer, session} from 'electron';
import path, {join} from 'path';
import global from "./global";
import HANDLERS from "./preload";
import dataSource from "./typeorm.config";
import settings from 'electron-settings';
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import backupDatabase from "./handlers/fs/backupDatabase";

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1540,
        height: 920,
        title: "Чаинка",
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false,
            // webviewTag: true,
        },
        autoHideMenuBar: true,
    });
    // mainWindow.removeMenu()

    if (process.env.NODE_ENV === 'development') {
        const appData = app.getPath('appData')
        app.setPath('userData', path.join(appData, '4ainka'))
        console.log(app.getPath('userData'))
        const rendererPort = process.argv[2];
        mainWindow.loadURL(`http://localhost:${rendererPort}`);
    } else {
        mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
    }
}

async function saveSettings() {
    const {
        host,
        port,
        username,
        database,
        password,
    } = dataSource.options as PostgresConnectionOptions
    await settings.set('db', {
        host: host ?? "",
        port: (port ?? 5432).toString(),
        username: username ?? "",
        database: database ?? "",
        password: (password as string) ?? "",
    })
}

async function loadSettings() {
    return await settings.get('db')
}

app.whenReady().then(async () => {
    // await dataSource.initialize()

    createWindow();

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ['script-src \'self\'']
            }
        })
    })

    ipcMain.handle("db:status", () => {
        return dataSource.isInitialized
    })

    ipcMain.handle("db:options", async () => {
        const {
            host,
            port,
            username,
            database,
            password,
        } = ((await settings.get('db')) || dataSource.options) as any
        return {
            host,
            port,
            username,
            database,
            password,
        }
    })

    ipcMain.handle("db:connect", async (event, options: Partial<PostgresConnectionOptions>) => {
        dataSource.setOptions(options)
        await dataSource.initialize()
        let status = dataSource.isInitialized
        if (status) {
            await saveSettings()
        }
        return dataSource.isInitialized
    })

    ipcMain.handle("db:backup", (event) => {
        backupDatabase()
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