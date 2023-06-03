import {
    Entity,
    Column,
    PrimaryGeneratedColumn, OneToMany, In, UpdateDateColumn, CreateDateColumn,
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

    @Column()
    title: string;

    @UpdateDateColumn()
    @CreateDateColumn()
    modified_at: Date;

    @Column()
    jekyll_folder: string;

    @Column()
    deploy_command: string;

    @Column()
    site_url: string;

    @Column()
    archive: boolean;

    @Column({type: "jsonb"})
    groups: Array<number>;


    @OneToMany(() => Lab, (lab) => lab.discipline)
    labs: Lab[]
}