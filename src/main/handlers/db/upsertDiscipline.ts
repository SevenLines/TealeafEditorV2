import dataSource from "../../typeorm.config";
import {Discipline} from "../../models/discipline.entity";

export default async function upsertDiscipline(event, discipline: Discipline): Promise<Discipline | null> {
    if (discipline.id) {
        discipline.modified_at = new Date()
        await dataSource.manager.update(Discipline,  discipline.id, discipline)
    } else {
        discipline.modified_at = new Date()
        discipline = (await dataSource.manager.insert(Discipline, discipline)).raw
    }
    return discipline;
}


