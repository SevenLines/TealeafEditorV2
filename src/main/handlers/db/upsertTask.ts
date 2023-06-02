import dataSource from "../../typeorm.config";
import {Task} from "../../models/task.entity";

export default async function upsertTask(event, task: Task): Promise<Task | null> {
    if (task.id) {
        await dataSource.manager.update(Task,  task.id, task)
    } else {
        task = (await dataSource.manager.insert(Task, task)).raw
    }
    return task
}


