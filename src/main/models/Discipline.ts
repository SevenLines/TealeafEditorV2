import Lab from "./Lab";

const {DataTypes} = require('sequelize');
import {db} from '../db';
import {Model} from "sequelize";

const yaml = require('js-yaml')
import fs, {existsSync, readFileSync, unlink, unlinkSync} from 'fs'
import fsExtra from 'fs-extra';
import path, {resolve, join} from "path";
import {Table, Column} from "./decorators";
import setDefault, {getFiles} from "../utils";
import TaskGroup from "./TaskGroup";
import Student from "./Student";


@Table({
    sequelize: db,
    modelName: "Discipline",
    tableName: "lessons_discipline",
    createdAt: false,
    updatedAt: "modified_at"
})
export default class Discipline extends Model {
    id!: number;

    @Column(DataTypes.STRING)
    title!: string;

    @Column(DataTypes.DATE)
    modified_at!: Date;

    @Column(DataTypes.STRING)
    jekyll_folder!: string;

    @Column(DataTypes.STRING)
    deploy_command!: string;

    @Column(DataTypes.STRING)
    site_url!: string;

    @Column(DataTypes.BOOLEAN)
    archive!: boolean;

    @Column(DataTypes.JSONB)
    groups!: Array<number>;

    getLabs!: { (params?: any): Promise<Array<Lab>> };

    async generateLabsYaml() {
        if (!fs.existsSync(this.jekyll_folder)) {
            return;
        }

        let data: {
            order: string[]
            labs: {[alias: string]: Lab | any}
            students: {[id: number]: Student | any}
            groups: {[id: number]: TaskGroup | any}
        } = {
            'order': [],
            'labs': {},
            'students': {},
            'groups': {},
        }

        let labsFolder = path.join(this.jekyll_folder, "_labs");
        if (!fs.existsSync(labsFolder)) {
            fs.mkdirSync(labsFolder);
        }
        await fsExtra.emptyDir(labsFolder)
        let tasksFolder = path.join(this.jekyll_folder, "_tasks");
        if (!fs.existsSync(tasksFolder)) {
            fs.mkdirSync(tasksFolder);
        }
        await fsExtra.emptyDir(tasksFolder)
        let labs = await this.getLabs({order: [["order"], ["title"]]})

        for (let lab of labs) {
            let filename = path.join(labsFolder, `${lab.alias}.md`);

            if (!lab.visible) {
                continue;
            }

            let labFileContent = `---
layout: lab
alias: ${lab.alias}
title: ${lab.title}
---
`
            await fs.writeFile(filename, labFileContent, err => {
                console.log(err)
            })

            data.order.push(lab.alias)
            data['labs'][lab.alias] = {}

            let lab_item = data['labs'][lab.alias]
            lab_item['title'] = lab.title
            lab_item['icon'] = lab.icon
            lab_item['description'] = lab.content
            lab_item['description_additional'] = lab.content_additional
            lab_item['type'] = lab.type
            lab_item['remark'] = lab.remark
            lab_item['alias'] = lab.alias
            lab_item['secret'] = lab.secret
            lab_item['task_done'] = {}

            let task_groups: any = {}
            let tasks = await lab.getTasks({order: [["order"], ["id"]]})
            let order = 0;
            for (let t of tasks) {
                let dir = path.join(this.jekyll_folder, "_tasks")
                let filename = path.join(dir, `${t.id}.md`);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                if (!t.visible) {
                    continue;
                }

                let task_group = null;
                if (task_groups[t.group_id]) {
                    task_group = task_groups[t.group_id]
                } else {
                    let tg = await t.getTaskGroup();
                    task_group = setDefault(task_groups, t.group_id || 0, {
                        'id': t.group_id || 0,
                        'title': t.group_id ? tg.title : "default",
                        'tasks': [],
                        'type': t.group_id ? tg.type : lab.type,
                    })
                }

                if (!task_group) {
                    continue
                }

                tasks = task_group['tasks']

                // if (t.additional_content) {

                    let title = t.title ? t.title : t.content.replace(/\n+/gi, " - ").replace(/(<([^>]+)>)/gi, "").replace(/[:!\[\]/()`']/gi, "");
                    let task_header = t.title ? t.title : `подсказка к ${order + 1} задачке`;
                    let taskFileContent = `---
layout: task
alias: ${lab.alias}
task_group_id: ${t.group_id || 0}
task_id: ${t.id}
task_order: ${order}
title:  ${lab.title} / ${title}
header: <a href="/labs/${lab.alias}.html">${lab.title}</a> / ${task_header}
---
            `
                    await fs.writeFile(filename, taskFileContent, err => {
                        if (err) {
                            console.log(err)
                        }
                    })
                // }

                let task_item = {
                    "id": t.id,
                    "description": t.content,
                    "title": t.title,
                    "description2": t.additional_content,
                    "difficult": t.complexity,
                    "custom_class": t.custom_class,
                    "task_group": t.group_id,
                    "visible": t.visible,
                    "youtube_link": t.youtube_link,
                    "students": [],
                    "subtasks": t.subtasks,
                    "order": order,
                    "show_help_in_modal": t.show_help_in_modal,
                }

                tasks.push(task_item as any)

                order++;
            }

            lab_item['task_groups'] = task_groups
        }

        let dump = yaml.dump(data)
        let filename = path.join(this.jekyll_folder, "_data", "labs.yaml");
        await fs.writeFile(filename, dump, err => {
            console.log(err)
        })
    }

    async getImages() {
        let labs = await this.getLabs();

        let images: string[] = []
        for (const lab of labs) {
            images.push(...await lab.getImages());
        }

        let reg = /\!\[.*?\]\((.*?)\)/g;
        let files = await getFiles(`${this.jekyll_folder}/common`);
        for (const file of files) {
            let text = readFileSync(file, 'utf8');
            let result = Array.from(text.matchAll(reg))
            if (result) {
                images.push(...result.map(x => x[1]))
            }
        }

        return images
    }

    async removeUnusedImages() {
        let images = await this.getImages();

        let sources = images.map(x => {
            return join(this.jekyll_folder, x)
        }).filter(x => existsSync(x))

        let filesToRemove = await getFiles(`${this.jekyll_folder}/assets/copied`);
        filesToRemove.push(...await getFiles(`${this.jekyll_folder}/assets/tasks`));
        filesToRemove = filesToRemove.filter(x => !sources.includes(x))
            .filter(x => x.endsWith('.png') || x.endsWith('.gif') || x.endsWith('.jpg') || x.endsWith('.jpeg'))

        if (filesToRemove.length > 0) {
            console.log(filesToRemove)
            if (confirm(`Точно удалить ${filesToRemove.length} картинок`)) {
                filesToRemove.forEach(unlinkSync);
                alert("Лишние картинки успешно удалились")
            }
        } else {
            alert("Лишних картинок не найдено")
        }
    }

    async copy() {
        let newDiscipline = await Discipline.create({
            ...this.get({plain: true}),
            title: "[КОПИЯ] " + this.title,
            id: undefined
        });

        let labs = await this.getLabs()
        for (const l of labs) {
            await l.copy({
                DisciplineId: newDiscipline.id,
                discipline_id: newDiscipline.id,
            })
        }

        return newDiscipline;
    }
}

Discipline.hasMany(Lab, {
    foreignKey: {
        field: "discipline_id"
    },
    onDelete: "cascade",
})
Lab.belongsTo(Discipline)
