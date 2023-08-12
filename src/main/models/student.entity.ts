import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Discipline} from "./discipline.entity";

@Entity({
    name: "students",
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
    group_title: number;

    @Column()
    visible: boolean;

    @ManyToMany(() => Discipline, (discipline) => discipline.students)
    questions: Discipline[]
}