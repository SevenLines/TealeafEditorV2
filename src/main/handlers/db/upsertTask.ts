import dataSource from "../../typeorm.config";
import {Lab} from "../../models/lab.entity";
import {Task} from "../../models/task.entity";

export default async function upsertTask(event, task: Task): Promise<Task | null> {
    if (task.id) {
        await dataSource.manager.update(Task,  task.id, task)
    } else {
        task = (await dataSource.manager.insert(Task, task)).raw
    }
    return task
}


