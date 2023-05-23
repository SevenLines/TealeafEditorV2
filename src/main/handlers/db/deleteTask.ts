import Lab from "../../models/Lab";
import Discipline from "../../models/Discipline";
import Task from "../../models/Task";

export default async function deleteTask(event, taskId: number) {
    await Task.destroy({where: {id: taskId}})
}


