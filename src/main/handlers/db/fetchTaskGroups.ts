import dataSource from "../../typeorm.config";
import TaskGroup from "../../models/task_group.entity";

export default async function fetchTaskGroups(event, labId: number) : Promise<TaskGroup[]> {
    let groups = await dataSource.manager.find(TaskGroup, {
        where: {
            lab_id: labId,
        }, order: {"order":  "ASC"}})

    return groups;
}