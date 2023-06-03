import {contextBridge, ipcRenderer} from 'electron';

const HANDLERS = [
    "db:labCopyTasksToLab",

    "fs:previewRenderFunc",
    "fs:uploadFileFunc",
    "fs:openUrlInBrowser",

    "deploy:runDeployProcess",
    "deploy:runJekyllProcess",
    "deploy:stopJekyllProcess",
]


async function repositoryFunc(repoName, method, data) {
    return ipcRenderer.invoke("repository:exec", repoName, method, data)
}

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
            backup: (backupDatabase) => ipcRenderer.invoke("db:backup")
        },
        disciplineRepository: {
            remove: (data) => repositoryFunc("DisciplineRepository", "remove", data),
            get: (data) => repositoryFunc("DisciplineRepository", "get", data),
            list: (data) => repositoryFunc("DisciplineRepository", "list", data),
            upsert: (data) => repositoryFunc("DisciplineRepository", "upsert", data),
            getLabs: (data) => repositoryFunc("DisciplineRepository", "getLabs", data),
            disciplineCopy: (data) => repositoryFunc("DisciplineRepository", "disciplineCopy", data),
            disciplineGenerateLabsYaml: (data) => repositoryFunc("DisciplineRepository", "disciplineGenerateLabsYaml", data),
            disciplineGetImages: (data) => repositoryFunc("DisciplineRepository", "disciplineGetImages", data),
            disciplineRemoveUnusedImages: (data) => repositoryFunc("DisciplineRepository", "disciplineRemoveUnusedImages", data),
        },
        labsRepository: {
            remove: (data) => repositoryFunc("LabRepository", "remove", data),
            get: (data) => repositoryFunc("LabRepository", "get", data),
            list: (data) => repositoryFunc("LabRepository", "list", data),
            updateLabsOrder: (data) => repositoryFunc("LabRepository", "updateLabsOrder", data),
            upsert: (data) => repositoryFunc("LabRepository", "upsert", data),
            getTasks: (data) => repositoryFunc("LabRepository", "getTasks", data),
        },
        taskRepository: {
            remove: (data) => repositoryFunc("TaskRepository", "remove", data),
            get: (data) => repositoryFunc("TaskRepository", "get", data),
            list: (data) => repositoryFunc("TaskRepository", "list", data),
            fetchTaskGroups: (data) => repositoryFunc("TaskRepository", "fetchTaskGroups", data),
            updateTasksOrder: (data) => repositoryFunc("TaskRepository", "updateTasksOrder", data),
            upsert: (data) => repositoryFunc("TaskRepository", "upsert", data),
        },
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
