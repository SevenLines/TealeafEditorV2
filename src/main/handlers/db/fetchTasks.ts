import Task from "../../models/Task";

export default async function fetchTasks(event, labId: number) : Promise<Task[]> {
    let tasks = await Task.findAll({where: {
            lab_id: labId,
        }, order: [["order", "ASC"]], raw: true})

    return tasks;
}