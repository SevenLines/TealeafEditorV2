import dataSource from "../typeorm.config";
import {Discipline} from "../models/discipline.entity";
import {Lab} from "../models/lab.entity";
import {FindOptionsWhere} from "typeorm";
import TaskRepository from "./TaskRepository";
import {Task} from "../models/task.entity";

export default class LabRepository {
    static async remove(labId: number) {
        await dataSource.getRepository(Task).delete({
            lab_id: labId
        })
        await dataSource.getRepository(Lab).delete({id: labId})
    }

    static async get(id: number): Promise<Lab | null> {
        return await dataSource.manager.findOneBy(Lab, {id: id});
    }

    static async list(whereCondition: FindOptionsWhere<Lab>): Promise<Lab[]> {
        let labs = await dataSource.manager.find(Lab, {
            where: whereCondition, order: {order: 1}
        })

        return labs;
    }

    static async getTasks(labId: number) {
        return TaskRepository.list({
            lab_id: labId
        })
    }

    static async updateLabsOrder(labs: Lab[]) {
        let orders = labs.map((x, index) => ({...x, order: index}))
        await dataSource.getRepository(Lab).save(orders)
    }

    static async upsert(lab: Lab): Promise<Lab | null> {
        if (lab.id) {
            lab.modified_at = new Date()
            await dataSource.getRepository(Lab).update(lab.id, lab)
        } else {
            lab.modified_at = new Date()
            lab = (await dataSource.getRepository(Lab).insert(lab)).raw
        }
        return lab;
    }

    static async copy(lab: Lab, labParams?: any) {
        let newLab = dataSource.manager.create(Lab, {
            ...lab,
            ...labParams,
            id: undefined
        });
        await dataSource.manager.save(newLab)

        let tasks = await dataSource.manager.find(Task, {
            where: {
                lab_id: lab.id
            }
        })
        let newTasks = tasks.map(t => {
            return {
                ...t,
                lab_id: newLab.id,
                id: undefined,
            }
        })
        await dataSource.manager.insert(Task, newTasks)
        return newLab
    }

    static async getImages(lab: Lab): Promise<string[]> {
        let images: string[] = [];

        let reg = /\!\[.*?\]\((.*?)\)/g;

        let result = []
        for(const key of ['content', 'content_additional']) {
            result = Array.from(lab[key].matchAll(reg))
            if (result) {
                images.push(...result.map(x => x[1]))
            }
        }

        let tasks = await dataSource.manager.find(Task, {
            where: {lab_id: lab.id}
        })

        for (const task of tasks) {
            images.push(...TaskRepository.getImages(task));
        }

        return images;
    }
}