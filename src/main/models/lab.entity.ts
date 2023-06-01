import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from "typeorm"


@Entity()
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

    @Column()
    modified_at: Date;

    @Column()
    discipline_id: number;

    @Column()
    visible: boolean;

    @Column()
    secret: boolean;

    async copy(labParams?: any) {
        let newLab = await Lab.create({
            ...this.get({plain: true}),
            ...labParams,
            id: undefined
        });

        let tasks = await this.getTasks()
        let newTasks = tasks.map(t => {
            return {
                ...t.get({plain: true}),
                lab_id: newLab.id,
                LabId: newLab.id,
                id: undefined,
            }
        })
        await Task.bulkCreate(newTasks)
        return newLab
    }

    async getImages(): Promise<string[]> {
        let images: string[] = [];

        let reg = /\!\[.*?\]\((.*?)\)/g;

        let result = []
        for(const key of ['content', 'content_additional']) {
            result = Array.from(this[key].matchAll(reg))
            if (result) {
                images.push(...result.map(x => x[1]))
            }
        }

        for (const task of await this.getTasks()) {
            images.push(...task.getImages());
        }

        return images;
    }
}