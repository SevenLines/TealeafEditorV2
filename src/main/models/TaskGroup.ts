import {db} from "../db";
import Task from "./Task";
import {Model} from "sequelize";
import {Column, Table} from "./decorators";
const {DataTypes} = require('sequelize');


@Table({
    sequelize: db,
    modelName: "TaskGroup",
    tableName: "lessons_taskgroup",
    timestamps: false
})
export default class TaskGroup extends Model {
    id;

    @Column(DataTypes.STRING)
    title;

    @Column(DataTypes.NUMBER)
    lab_id;

    @Column(DataTypes.NUMBER)
    type;

    @Column(DataTypes.NUMBER)
    order;

    getTasks;
}

TaskGroup.hasMany(Task, {
    foreignKey: {
        field: "group_id"
    }
})
Task.belongsTo(TaskGroup)
