import dataSource from "../../typeorm.config";
import {Discipline} from "../../models/discipline.entity";

export default async function disciplineCopy(event, disciplineId: number): Promise<Discipline | null> {
    let discipline = await dataSource.manager.findOneBy(Discipline, {id: disciplineId})
    let newDiscipline = await discipline?.copy()
    if (newDiscipline)
        return newDiscipline
    return null
}