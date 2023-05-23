import Task from "../../models/Task";
import {Op, Sequelize} from "sequelize";
import path from "path";
import fsExtra from "fs-extra";
import fs from "fs";

export default async function labCopyTasksToLab(event, labId: number, jekyllFolder: string, tasks: Task[], activeGroupId: number | null) {
    let tas = await Task.findAll({
        where: {
            lab_id: labId
        },
        attributes: [[Sequelize.fn('max', Sequelize.col('order')), 'max_order']],
        raw: true,
    })

    let realTasks = await  Task.findAll({
        where: {
            id: {
                [Op.in]: tasks.map(x => x.id),
            }
        }
    })

    let maxOrder = 0;
    if (tas.length > 0) {
        maxOrder = (tas[0] as any).max_order
    }

    let i = 1;
    let regexp = /\!\[\]\((\/assets\/.*?)\)/gm;
    let lab = await realTasks[0].getLab();
    let discipline = await lab.getDiscipline();

    for (const t of realTasks) {
        let data = t.get({plain: true})
        let items = [
            ...data.content.matchAll(regexp),
            ...data.additional_content.matchAll(regexp),
        ];
        items = items.map(i => {
            let new_match = path.join("copied", discipline.id.toString(), lab.id.toString(), path.basename(i[1]))
            let pth = path.join("assets", new_match).replace(/\\/g, "/");
            let to = path.join(jekyllFolder, "assets", new_match);

            let dir = path.dirname(to);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            return {
                "match": i[0],
                "from": path.join(discipline.jekyll_folder, i[1]),
                "new_match": `![](/${pth})`,
                "to": to,
            }
        })

        for(const item of items) {
            fsExtra.copySync(item.from, item.to)
            data.content = data.content.replace(item['match'], item['new_match'])
            data.additional_content = data.additional_content.replace(item['match'], item['new_match'])
        }

        delete data.id
        data.lab_id = labId
        data.order = maxOrder + i
        data.LabId = labId
        data.group_id = activeGroupId
        data.TaskGroupId = activeGroupId
        await Task.create(data)
        i++;
    }
}