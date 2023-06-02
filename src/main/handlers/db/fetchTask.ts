import {Task} from "../../models/task.entity";
import dataSource from "../../typeorm.config";

export default async function fetchTask(event, id: number): Promise<Task | null> {
    return await dataSource.manager.findOneBy(Task, {id: id});
}


