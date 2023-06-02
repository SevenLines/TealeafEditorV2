import {Task} from "../../models/task.entity";
import dataSource from "../../typeorm.config";

export default async function updateTasksOrder(event, tasks: Task[]) {
    let orders = tasks.map((x, index) => ({...x, order: index}))
    await dataSource.getRepository(Task).save(orders)
}