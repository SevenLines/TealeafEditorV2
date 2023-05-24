import path from "path";
import child_process from "child_process";
import {spawnAsync} from "../../utils";
const kill = require('tree-kill');
import Discipline from "../../models/Discipline";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;


export default async function stopJekyllProcess(event:IpcMainInvokeEvent, disciplineId)
{
    let activeDiscipline = await Discipline.findByPk(disciplineId)
    if (!activeDiscipline)
        return

    if (global.shared.jekyllProcess) {
        kill(global.shared.jekyllProcess.pid)
        global.shared.jekyllProcess = null
    }
}