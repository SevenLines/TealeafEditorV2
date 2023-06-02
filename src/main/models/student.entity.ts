import {Model} from "sequelize";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({
    name: "lessons_student",
})
export default class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    second_name: string;

    @Column()
    patronymic: string;

    @Column()
    sex: number

    @Column()
    group_id: number;

    @Column()
    visible: boolean;
}