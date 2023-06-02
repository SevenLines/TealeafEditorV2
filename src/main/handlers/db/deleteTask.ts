import dataSource from "../../typeorm.config";
import {Task} from "../../models/task.entity";

export default async function deleteTask(event, taskId: number) {
    await dataSource.getRepository(Task).delete({id: taskId})
}


