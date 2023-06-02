import {Lab} from "../../models/lab.entity";
import dataSource from "../../typeorm.config";

export default async function upsertLab(event, lab: Lab): Promise<Lab | null> {
    if (lab.id) {
        lab.modified_at = new Date()
        await dataSource.getRepository(Lab).update(lab.id, lab)
    } else {
        lab.modified_at = new Date()
        lab = (await dataSource.getRepository(Lab).insert(lab)).raw
    }
    return lab;
}


