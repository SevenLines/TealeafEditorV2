import {
    Entity,
    Column,
    PrimaryGeneratedColumn, OneToMany, In, UpdateDateColumn, CreateDateColumn, ManyToMany,
} from "typeorm"
import {Task} from "./task.entity";
import dataSource from "../typeorm.config";
import fs, {existsSync, readFileSync, unlinkSync} from "fs";
import path, {join} from "path";
import fsExtra from "fs-extra";
import setDefault, {getFiles} from "../utils";
import yaml from "js-yaml";
import {Lab} from "./lab.entity";
import _ from "lodash";
import TaskGroup from "./task_group.entity";
import Student from "./student.entity";


@Entity({
    name: 'lessons_discipline'
})
export class Discipline {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    title: string;

    @UpdateDateColumn({type: "timestamp with time zone"})
    @CreateDateColumn({type: "timestamp with time zone"})
    modified_at: Date;

    @Column({type: "text"})
    jekyll_folder: string;

    @Column({type: "text", nullable: true})
    deploy_command: string;

    @Column({type: "varchar", length: 255, nullable: true})
    site_url: string;

    @Column({default: false, nullable: true})
    archive: boolean;

    @Column({type: "jsonb", nullable: true})
    groups: Array<number>;

    @OneToMany(() => Lab, (lab) => lab.discipline)
    labs: Lab[]

    @ManyToMany(() => Student)
    students: Student[]
}