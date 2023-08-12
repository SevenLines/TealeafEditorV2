import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({
    name: "lessons_group",
})
export default class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    title: string;

    @Column({type: "smallint"})
    year: number;
}