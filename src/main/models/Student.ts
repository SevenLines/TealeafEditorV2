import {Column, Table} from "./decorators";
import {db} from "../db";
import {DataTypes, Model} from "sequelize";

@Table({
    sequelize: db,
    modelName: "Student",
    tableName: "lessons_student",
    timestamps: false,
})
export default class Student extends Model {
    id!: number;

    @Column(DataTypes.STRING)
    name!: string;

    @Column(DataTypes.STRING)
    second_name!: string;

    @Column(DataTypes.STRING)
    patronymic!: string;

    @Column(DataTypes.NUMBER)
    sex!: number

    @Column(DataTypes.NUMBER)
    group_id!: number;

    @Column(DataTypes.BOOLEAN)
    visible!: boolean;
}