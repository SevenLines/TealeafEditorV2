import {contextBridge, ipcRenderer} from 'electron';

const HANDLERS = [
    "db:fetchDisciplines",
    "db:fetchLabs",
    "db:fetchTaskGroups",
    "db:fetchTasks",
    "db:fetchDiscipline",
    "db:fetchLab",
    "db:fetchTask",

    "db:upsertDiscipline",
    "db:upsertLab",
    "db:upsertTask",
    "db:updateLabsOrder",
    "db:updateTasksOrder",
    "db:disciplineCopy",

    "db:deleteDiscipline",
    "db:deleteLab",
    "db:deleteTask",

    "db:disciplineGenerateLabsYaml",
    "db:disciplineGetImages",
    "db:disciplineRemoveUnusedImages",
    "db:labCopyTasksToLab",


    "fs:previewRenderFunc",
    "fs:uploadFileFunc",
    "fs:openUrlInBrowser",

    "deploy:runDeployProcess",
    "deploy:runJekyllProcess",
    "deploy:stopJekyllProcess",
]


try {
    const api = {
        sendMessage: (message: string) => ipcRenderer.send('message', message),
        onPushJekyllLogItem: (callback) => ipcRenderer.on('pushJekyllLogItem', (event, args) => {
            console.log(args)
            callback(event, args)
        }),
        globalShared: () => {
            return global.shared;
        },
        db: {
            status: () => ipcRenderer.invoke("db:status"),
            options: () => ipcRenderer.invoke("db:options"),
            connect: (options) => ipcRenderer.invoke("db:connect", options),
        }
    }

    for (let h of HANDLERS) {
        let [prefix, funcName] = h.split(":");
        funcName = funcName.charAt(0).toUpperCase() + funcName.substring(1)
        api[prefix + funcName] = (...params) => {
            return ipcRenderer.invoke(h, ...params)
        }
    }
    contextBridge.exposeInMainWorld('electronAPI', api)
} catch(e) {
    console.log(e)
}


export default HANDLERS
