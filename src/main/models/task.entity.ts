import {
    Entity,
    Column,
    PrimaryGeneratedColumn, ManyToOne, JoinColumn,
} from "typeorm"
import {Lab} from "./lab.entity";
export interface Subtask {
    content: string;
}

export interface StudentInfo {
    id: number;
    date_done: Date;
}


@Entity({
    name: "lessons_task"
})
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", {nullable: true})
    title: string;

    @Column()
    complexity: number;

    @Column("text")
    content: string;

    @Column("text")
    additional_content: string;

    @Column()
    order: number;

    @Column("text", {array: true, nullable: true})
    tags: string[];

    @Column()
    visible: boolean;

    @Column({nullable: true})
    group_id: number;

    @Column()
    lab_id: number;

    @ManyToOne(() => Lab, (lab) => lab.tasks)
    @JoinColumn({ name: "lab_id" })
    lab: Lab;

    @Column("text", {nullable: true})
    custom_class: string;

    @Column("varchar", {length: 255, nullable: true})
    youtube_link: string;

    @Column({type: "jsonb", nullable: true})
    subtasks: Subtask[]

    @Column({type: "jsonb", nullable: true})
    students_info: StudentInfo[]

    @Column({nullable: true, default: false})
    show_help_in_modal: boolean;

    @Column({nullable: true})
    tip: string;
}