import {db} from "../db";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Task} from "./task.entity";
import {Lab} from "./lab.entity";


@Entity({
    name: "lessons_taskgroup",
})
export default class TaskGroup {
    @PrimaryGeneratedColumn()
    id;

    @Column()
    title: number;

    @Column()
    lab_id: number;

    @ManyToOne(() => Lab, (lab) => lab.groups)
    @JoinColumn({name: "lab_id"})
    lab: Lab

    @Column()
    type: number;

    @Column()
    order: number;
}
