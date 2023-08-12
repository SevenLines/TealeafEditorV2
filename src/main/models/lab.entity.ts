import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    AfterUpdate,
    AfterRemove,
    UpdateDateColumn,
    CreateDateColumn, AfterInsert,
} from "typeorm"
import {Task} from "./task.entity";
import dataSource from "../typeorm.config";
import {Discipline} from "./discipline.entity";
import TaskGroup from "./task_group.entity";


@Entity({
    name: "lessons_lab"
})
export class Lab {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text"})
    alias: string;

    @Column({type: "text"})
    title: string;

    @Column()
    order: number;

    @Column({type: "text"})
    icon: string;

    @Column({nullable: true})
    group_id: number;

    @Column()
    type: number;

    @Column({type: "text"})
    content: string;

    @Column({type: "text"})
    content_additional: string;

    @Column({nullable: true})
    tip: string;

    @Column({type: "text"})
    remark: string;

    @UpdateDateColumn({type: "timestamp with time zone"})
    @CreateDateColumn({type: "timestamp with time zone"})
    modified_at: Date;

    @ManyToOne(() => Discipline, (discipline) => discipline.labs)
    @JoinColumn({ name: "discipline_id" })
    discipline: Discipline;

    @Column()
    discipline_id: number;

    @Column({nullable: true})
    visible: boolean;

    @Column({nullable: true, default: false})
    secret: boolean;

    @OneToMany(() => Task, (task) => task.lab)
    tasks: Task[]

    @OneToMany(() => TaskGroup, (group) => group.lab)
    groups: TaskGroup[]


    // @AfterUpdate()
    // @AfterRemove()
    // @AfterInsert()
    // async rebuild() {
    //     let discipline = await dataSource.manager.findOneBy(Discipline, {id: this.discipline_id})
    //     if (discipline) {
    //         await discipline.generateLabsYaml()
    //     }
    // }
}