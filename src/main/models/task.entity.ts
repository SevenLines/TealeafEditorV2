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

    @Column()
    title: string;

    @Column()
    complexity: number;

    @Column()
    content: string;

    @Column()
    additional_content: string;

    @Column()
    order: number;

    @Column("text", {array: true})
    tags: string[];

    @Column()
    visible: boolean;

    @Column()
    group_id: number;

    @Column()
    lab_id: number;

    @ManyToOne(() => Lab, (lab) => lab.tasks)
    @JoinColumn({ name: "lab_id" })
    lab: Lab;

    @Column()
    custom_class: string;

    @Column()
    youtube_link: string;

    @Column({type: "jsonb"})
    subtasks: Subtask[]

    @Column({type: "jsonb"})
    students_info: StudentInfo[]

    @Column()
    show_help_in_modal: boolean;


}