import dataSource from "../../typeorm.config";
import {Task} from "../../models/task.entity";

export default async function fetchTasks(event, labId: number) : Promise<Task[]> {
    let tasks = await dataSource.manager.find(Task,{
        where: {
            lab_id: labId,
        }, order: {order: "ASC"}})

    return tasks;
}