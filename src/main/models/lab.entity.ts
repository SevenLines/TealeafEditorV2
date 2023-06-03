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

    @Column()
    alias: string;

    @Column()
    title: string;

    @Column()
    order: number;

    @Column()
    icon: string;

    @Column()
    group_id: number;

    @Column()
    type: number;

    @Column()
    content: string;

    @Column()
    content_additional: string;

    @Column()
    remark: string;

    @UpdateDateColumn()
    @CreateDateColumn()
    modified_at: Date;

    @ManyToOne(() => Discipline, (discipline) => discipline.labs)
    @JoinColumn({ name: "discipline_id" })
    discipline: Discipline;

    @Column()
    discipline_id: number;

    @Column()
    visible: boolean;

    @Column()
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