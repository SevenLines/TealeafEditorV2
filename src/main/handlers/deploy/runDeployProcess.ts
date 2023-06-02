import path from "path";
import child_process from "child_process";
import {spawnAsync} from "../../utils";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
import {Discipline} from "../../models/discipline.entity";
import dataSource from "../../typeorm.config";

export default async function runDeployProcess(event:IpcMainInvokeEvent, disciplineId: number, createGitCommit: boolean)
{
    let activeDiscipline = await dataSource.manager.findOneBy(Discipline, {id: disciplineId})
    if (!activeDiscipline)
        return

    if (createGitCommit) {
        event.sender.send("pushJekyllLogItem", `фиксирую изменения в stage\n`)
        await spawnAsync(`git add ${activeDiscipline.jekyll_folder}`, {
            shell: true,
            cwd: activeDiscipline.jekyll_folder,
        }, (data) => {
            event.sender.send("pushJekyllLogItem", `${data}\n`)
        })

        event.sender.send("pushJekyllLogItem", `пытаюсь создать коммит\n`)
        await spawnAsync(`git commit -a -m "автоматический коммит из чаинки натуральной"`, {
            shell: true,
            cwd: activeDiscipline.jekyll_folder
        }, (data) => {
            event.sender.send("pushJekyllLogItem", `${data}\n`)
        })

        event.sender.send("pushJekyllLogItem", `отправляю на сервер\n`)
        await spawnAsync("git push", {
            shell: true,
            cwd: activeDiscipline.jekyll_folder,
        }, (data) => {
            event.sender.send("pushJekyllLogItem", `${data}\n`)
        })
    }
    let params = activeDiscipline.deploy_command.split(/\s+/)

    let fab = params[0]
    let cwd = path.dirname((path.dirname(activeDiscipline.jekyll_folder)));
    let args = params.splice(1)
    let ps = child_process.spawn(fab, args, {
        cwd,
    });

    ps.stderr.on('data', (data) => {
        let content = data.toString().replace(/\n|(\r\n)|(\n\r)/gi, "<br>")
        content = content.replace(/\s/gi, "&nbsp;")
        event.sender.send("pushJekyllLogItem", content)
    });

    ps.on('error', (err) => {
        event.sender.send("pushJekyllLogItem", `${err}\n`)
    });

    ps.on('close', (code) => {
        // if (code == 0) {
        //     event.sender.send("setConsoleActive", false)
        // }
        event.sender.send("pushJekyllLogItem", `Процесс завершен с кодом ${code}\n`)
    });
}