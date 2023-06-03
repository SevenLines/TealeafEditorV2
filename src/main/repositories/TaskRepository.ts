import dataSource from "../typeorm.config";
import {FindOptionsWhere} from "typeorm";
import {Task} from "../models/task.entity";
import TaskGroup from "../models/task_group.entity";

export default class TaskRepository {
    static async remove(taskId: number) {
        await dataSource.getRepository(Task).delete({id: taskId})
    }

    static async get(id: number): Promise<Task | null> {
        return await dataSource.manager.findOneBy(Task, {id: id});
    }

    static async list(whereCondition: FindOptionsWhere<Task>): Promise<Task[]> {
        let tasks = await dataSource.manager.find(Task, {
            where: whereCondition,
            order: {order: "ASC"}
        })

        return tasks;
    }

    static async fetchTaskGroups(event, labId: number): Promise<TaskGroup[]> {
        let groups = await dataSource.manager.find(TaskGroup, {
            where: {
                lab_id: labId,
            }, order: {"order": "ASC"}
        })

        return groups;
    }

    static async updateTasksOrder(tasks: Task[]) {
        let orders = tasks.map((x, index) => ({...x, order: index}))
        await dataSource.getRepository(Task).save(orders)
    }

    static async upsert(task: Task): Promise<Task | null> {
        if (task.id) {
            await dataSource.manager.update(Task, task.id, task)
        } else {
            task = (await dataSource.manager.insert(Task, task)).raw
        }
        return task
    }

    static getImages(task: Task): Array<string> {
        let images: Array<string> = [];

        let reg = /\!\[.*?\]\((.*?)\)/g;
        let result = []
        for (const key of ['content', 'additional_content', "subtasks"]) {
            if (!task[key])
                continue

            result = Array.from(task[key].matchAll(reg))
            if (result) {
                images.push(...result.map(x => x[1]))
            }
        }

        return images;
    }
}