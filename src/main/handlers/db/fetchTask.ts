import Task from "../../models/Task";

export default async function fetchTask(event, id: number): Promise<Task | null> {
    return await Task.findByPk(id, {raw: true});
}


