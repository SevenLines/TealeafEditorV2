import path from "path";
import child_process from "child_process";
import {spawnAsync} from "../../utils";
const kill = require('tree-kill');
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
import dataSource from "../../typeorm.config";
import {Discipline} from "../../models/discipline.entity";


export default async function stopJekyllProcess(event:IpcMainInvokeEvent, disciplineId)
{
    let activeDiscipline = await dataSource.manager.findOneBy(Discipline, {id: disciplineId})
    if (!activeDiscipline)
        return

    if (global.shared.jekyllProcess) {
        kill(global.shared.jekyllProcess.pid)
        global.shared.jekyllProcess = null
    }
}