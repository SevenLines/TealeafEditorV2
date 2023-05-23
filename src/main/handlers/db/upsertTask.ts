import Task from "../../models/Task";

export default async function upsertTask(event, taskDTO: any): Promise<Task | null> {
    if (taskDTO.id) {
        let task = await Task.findByPk(taskDTO.id)
        if (task) {
            task.set(taskDTO)
            await task.save()
            return task.toJSON()
        }
    }
    return await Task.create({
        ...taskDTO
    })
}


