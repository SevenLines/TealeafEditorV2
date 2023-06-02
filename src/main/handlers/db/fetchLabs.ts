import {Lab} from "../../models/lab.entity";
import dataSource from "../../typeorm.config";

export default async function fetchLabs(event, disciplineId: number): Promise<Lab[]> {
    let labs = await dataSource.manager.find(Lab, {
        where: {
            discipline_id: disciplineId,
        }, order: {order: 1}
    })

    return labs;
}