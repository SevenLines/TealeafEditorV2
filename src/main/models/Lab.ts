import {Column, Table} from "./decorators";

const {DataTypes} = require('sequelize');
import {db} from '../db';
import {InstanceDestroyOptions, Model} from "sequelize";
import Task from "./Task";
import TaskGroup from "./TaskGroup";

@Table({
    sequelize: db,
    modelName: "Lab",
    tableName: "lessons_lab",
    createdAt: false,
    updatedAt: "modified_at",
    hooks: {
        async afterSave(instance, options) {
            let discipline = await instance.getDiscipline()
            await discipline.generateLabsYaml()
        },
        async afterDestroy(instance, options: InstanceDestroyOptions) {
            let discipline = await instance.getDiscipline()
            await discipline.generateLabsYaml()
        }
    }
})
export default class Lab extends Model {
    id!: number;

    @Column(DataTypes.STRING)
    alias!: string;

    @Column(DataTypes.STRING)
    title!: string;

    @Column(DataTypes.NUMBER)
    order!: number;

    @Column(DataTypes.STRING)
    icon!: string;

    @Column(DataTypes.NUMBER)
    group_id!: number;

    @Column(DataTypes.NUMBER)
    type!: number;

    @Column(DataTypes.STRING)
    content!: string;

    @Column(DataTypes.STRING)
    content_additional!: string;

    @Column(DataTypes.STRING)
    remark!: string;

    @Column(DataTypes.DATE)
    modified_at!: Date;

    @Column(DataTypes.NUMBER)
    discipline_id!: number;

    @Column(DataTypes.BOOLEAN)
    visible!: boolean;

    @Column(DataTypes.BOOLEAN)
    secret!: boolean;

    getTasks!: { (params?: any): Promise<Array<Task>> };
    Tasks!: Array<Task>;
    getDiscipline!: Function;

    async copy(labParams?: any) {
        let newLab = await Lab.create({
            ...this.get({plain: true}),
            ...labParams,
            id: undefined
        });

        let tasks = await this.getTasks()
        let newTasks = tasks.map(t => {
            return {
                ...t.get({plain: true}),
                lab_id: newLab.id,
                LabId: newLab.id,
                id: undefined,
            }
        })
        await Task.bulkCreate(newTasks)
        return newLab
    }

    async getImages(): Promise<Array<string>> {
        let images: Array<string> = [];

        let reg = /\!\[.*?\]\((.*?)\)/g;

        let result = []
        for(const key of ['content', 'content_additional']) {
            result = Array.from(this[key].matchAll(reg))
            if (result) {
                images.push(...result.map(x => x[1]))
            }
        }

        for (const task of await this.getTasks()) {
            images.push(...task.getImages());
        }

        return images;
    }
}

Lab.hasMany(Task, {
    foreignKey: {
        field: "lab_id"
    },
    onDelete: "cascade",
})
Lab.hasMany(TaskGroup, {
    foreignKey: {
        field: "lab_id"
    },
    onDelete: "cascade",
})
Task.belongsTo(Lab)
TaskGroup.belongsTo(Lab)
