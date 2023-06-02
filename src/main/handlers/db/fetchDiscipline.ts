import {Discipline} from "../../models/discipline.entity";
import dataSource from "../../typeorm.config";

export default async function fetchDiscipline(event, id: number): Promise<Discipline | null> {
    return await dataSource.manager.findOneBy(Discipline, {id: id});
}


