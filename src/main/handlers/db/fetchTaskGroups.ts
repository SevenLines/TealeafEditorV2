import Lab from "../../models/Lab";
import Discipline from "../../models/Discipline";
import Task from "../../models/Task";
import TaskGroup from "../../models/TaskGroup";

export default async function fetchTaskGroups(event, labId: number) : Promise<TaskGroup[]> {
    let groups = await TaskGroup.findAll({where: {
            lab_id: labId,
        }, order: [["order", "ASC"]], raw: true})

    return groups;
}