import {Op, Sequelize} from "sequelize";
import path from "path";
import fsExtra from "fs-extra";
import fs from "fs";
import dataSource from "../../typeorm.config";
import {In} from "typeorm";
import {Task} from "../../models/task.entity";
import {Lab} from "../../models/lab.entity";
import _ from "lodash";
import {Discipline} from "../../models/discipline.entity";

export default async function labCopyTasksToLab(event, labId: number, jekyllFolder: string, tasks: Task[], activeGroupId: number | null) {
    let tas = await dataSource.createQueryBuilder()
        .select("max(task.order) as max_order")
        .from(Task, "task")
        .where("task.lab_id = :lab_id", {lab_id: labId})
        .getMany()

    let realTasks = await dataSource.manager.find(Task, {
        where: {
            id: In(tasks.map(x => x.id))
        }
    })

    let labsById = _.keyBy(await dataSource.manager.find(Lab, {
        where: {
            id: In(tasks.map(x => x.lab_id))
        }
    }), "id")

    let maxOrder = 0;
    if (tas.length > 0) {
        maxOrder = (tas[0] as any).max_order
    }

    let i = 1;
    let regexp = /\!\[\]\((\/assets\/.*?)\)/gm;
    let lab = await dataSource.manager.findOneBy(Lab, {id: realTasks[0].lab_id})
    let discipline = await dataSource.manager.findOneBy(Discipline, {id: lab?.discipline_id})

    for (const t of realTasks) {
        let data: any = t
        let items: any = [
            ...data.content.matchAll(regexp),
            ...data.additional_content.matchAll(regexp),
        ];
        items = items.map(i => {
            if (discipline && lab) {
                let new_match = path.join("copied", discipline.id.toString(), lab.id.toString(), path.basename(i[1]))
                let pth = path.join("assets", new_match).replace(/\\/g, "/");
                let to = path.join(jekyllFolder, "assets", new_match);

                let dir = path.dirname(to);

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, {recursive: true});
                }

                return {
                    "match": i[0],
                    "from": path.join(discipline.jekyll_folder, i[1]),
                    "new_match": `![](/${pth})`,
                    "to": to,
                }
            }
        })

        for (const item of items) {
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
        await dataSource.manager.insert(Task, data)
        i++;
    }
}