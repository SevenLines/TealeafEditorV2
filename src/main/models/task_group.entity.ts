import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Lab} from "./lab.entity";


@Entity({
    name: "lessons_taskgroup",
})
export default class TaskGroup {
    @PrimaryGeneratedColumn()
    id;

    @Column("text")
    title: string;

    @Column({nullable: true})
    lab_id: number;

    @ManyToOne(() => Lab, (lab) => lab.groups)
    @JoinColumn({name: "lab_id"})
    lab: Lab

    @Column()
    type: number;

    @Column()
    order: number;
}
