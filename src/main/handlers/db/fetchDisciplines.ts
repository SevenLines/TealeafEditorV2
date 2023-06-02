import {Discipline} from "../../models/discipline.entity";
import dataSource from "../../typeorm.config";

export default async function fetchDisciplines() : Promise<Discipline[]> {
    let disciplines = await dataSource.manager.find(Discipline, {
        order: {
            title: "DESC"
        }
    })
    return disciplines;
}


