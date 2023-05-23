import Task from "../../models/Task";
import disciplineGenerateLabsYaml from "./disciplineGenerateLabsYaml";

export default async function updateTasksOrder(event, tasks: Task[]) {
    let orders = tasks.map((x, index) => ({...x, order: index}))
    await Task.bulkCreate(orders, {
        updateOnDuplicate: ['order', 'modified_at']
    })
}