import path from "path";
import child_process from "child_process";
// import {spawnAsync} from "../../utils";
// const kill = require('tree-kill');
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
import dataSource from "../../typeorm.config";
import {Discipline} from "../../models/discipline.entity";



export default async function runJekyllProcess(event:IpcMainInvokeEvent, disciplineId)
{
    let activeDiscipline = await dataSource.manager.findOneBy(Discipline, {id: disciplineId})
    if (!activeDiscipline)
        return

    child_process.spawn('serve.cmd', {
        detached: true,
        shell: true,
        cwd: activeDiscipline.jekyll_folder,
    });


    // if (global.shared.jekyllProcess) {
    //     kill(global.shared.jekyllProcess.pid)
    //     global.shared.jekyllProcess = null
    // }
    // if (activeDiscipline) {
    //     global.shared.jekyllProcess = child_process.spawn('serve.cmd', {
    //         // detached: true,
    //         shell: true,
    //         cwd: (activeDiscipline as Discipline).jekyll_folder,
    //     });
    //
    //     global.shared.jekyllProcess.stdout.on('data', (data) => {
    //         event.sender.send("pushJekyllLogItem", data)
    //     });
    //
    //     global.shared.jekyllProcess.on('close', (code) => {
    //         event.sender.send("pushJekyllLogItem", `child process exited with code ${code}\n`)
    //     });
    // }
}